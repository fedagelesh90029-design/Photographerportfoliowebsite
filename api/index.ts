import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Telegraf } from 'telegraf';
import 'dotenv/config';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-photographer-site';

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || 'https://dsydymmoggsjktjgugft.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service_role key for admin access
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '8898310243:AAED8H16pJtf7kt5foFou4ishGdWU2rpqWY');
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '7472331326';

// Middleware for auth
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Helper to send admin notification
const notifyAdmin = async (message: string) => {
  if (ADMIN_CHAT_ID) {
    try {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, message);
    } catch (err) {
      console.error('Failed to notify admin via Telegram:', err);
    }
  } else {
    console.log('Admin notification (ADMIN_CHAT_ID not configured):', message);
  }
};

// Multer storage setup (in-memory for cloud upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- PHOTO ROUTES ---
app.get('/api/photos', async (req, res) => {
  const photos = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(photos);
});

app.post('/api/photos', authenticateToken, async (req, res) => {
  const { url, category, description } = req.body;
  const photo = await prisma.photo.create({ data: { url, category, description } });
  res.json(photo);
});

app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const file = req.file;
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const filename = uniqueSuffix + path.extname(file.originalname);

  try {
    if (!supabase) {
      throw new Error('Cloud storage not configured (SUPABASE_SERVICE_ROLE_KEY is missing)');
    }

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Use relative path for frontend consistency, vercel.json rewrite will handle the rest
    const url = `/uploads/${filename}`;
    res.json({ url });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to upload' });
  }
});

app.delete('/api/photos/:id', authenticateToken, async (req, res) => {
  const photo = await prisma.photo.findUnique({ where: { id: parseInt(req.params.id) } });
  
  if (photo && photo.url.includes('/uploads/')) {
    const filename = photo.url.split('/').pop();
    if (filename && supabase) {
      try {
        await supabase.storage.from('uploads').remove([filename]);
      } catch (err) {
        console.error('Failed to delete from Supabase:', err);
      }
    }
  }
  
  await prisma.photo.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// --- CATEGORY ROUTES ---
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const category = await prisma.category.create({ data: { name } });
  res.json(category);
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// --- SETTINGS ROUTES ---
app.get('/api/settings/:key', async (req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: req.params.key } });
  res.json(setting);
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  const { key, value } = req.body;
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.json(setting);
});

// --- CONTACT ROUTE ---
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  const adminMsg = `📩 Новое сообщение с сайта!\n\nИмя: ${name}\nEmail: ${email}\nТема: ${subject}\nСообщение: ${message}`;
  await notifyAdmin(adminMsg);
  
  res.json({ success: true });
});

// --- INFO ROUTES ---
app.get('/api/info', async (req, res) => {
  const info = await prisma.info.findMany();
  const infoMap = info.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  res.json(infoMap);
});

app.post('/api/info', authenticateToken, async (req, res) => {
  const { key, value } = req.body;
  const info = await prisma.info.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.json(info);
});

// --- REVIEW ROUTES ---
app.get('/api/reviews', async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(reviews);
});

app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const { name, content, rating } = req.body;
  const review = await prisma.review.create({
    data: { name, content, rating, approved: false },
  });
  
  const adminMsg = `💬 Новый отзыв на модерации!\n\nИмя: ${name}\nРейтинг: ${rating}⭐\nТекст: ${content}\n\nОдобрите его в панели управления.`;
  await notifyAdmin(adminMsg);
  
  res.json(review);
});

app.put('/api/reviews/:id/approve', authenticateToken, async (req, res) => {
  const review = await prisma.review.update({
    where: { id: parseInt(req.params.id) },
    data: { approved: true },
  });
  res.json(review);
});

app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// --- TELEGRAM BOT & SUBSCRIBERS ---
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username;

  await prisma.subscriber.upsert({
    where: { telegramId },
    update: { username },
    create: { telegramId, username },
  });

  ctx.reply('Вы подписались на рассылку новостей!');
});

bot.launch();

app.post('/api/broadcast', authenticateToken, async (req, res) => {
  const { message } = req.body;
  const subscribers = await prisma.subscriber.findMany();

  for (const sub of subscribers) {
    if (sub.telegramId) {
      try {
        await bot.telegram.sendMessage(sub.telegramId, message);
      } catch (err) {
        console.error(`Failed to send message to ${sub.telegramId}:`, err);
      }
    }
  }

  res.json({ success: true, count: subscribers.length });
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;


