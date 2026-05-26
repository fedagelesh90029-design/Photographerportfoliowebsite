import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Seed categories
  const categories = [
    { name: 'Портрет' },
    { name: 'Свадьба' },
    { name: 'Мода' },
    { name: 'Lifestyle' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // Clear old photos for a fresh aesthetic look
  await prisma.photo.deleteMany({});

  // Seed aesthetic photos
  const photos = [
    // Портрет
    { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000", category: "Портрет" },
    { url: "https://images.unsplash.com/photo-1506794778242-aff564070750?q=80&w=1000", category: "Портрет" },
    { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000", category: "Портрет" },
    
    // Свадьба
    { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000", category: "Свадьба" },
    { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000", category: "Свадьба" },
    { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000", category: "Свадьба" },

    // Мода
    { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000", category: "Мода" },
    { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000", category: "Мода" },
    { url: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000", category: "Мода" },

    // Lifestyle
    { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000", category: "Lifestyle" },
    { url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000", category: "Lifestyle" },
    { url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=1000", category: "Lifestyle" },
  ];

  for (const photo of photos) {
    await prisma.photo.create({ data: photo });
  }

  // Seed default settings
  await prisma.setting.upsert({
    where: { key: 'hero_banner' },
    update: { value: "https://images.unsplash.com/photo-1492691523567-61125c857db3?q=80&w=2070" },
    create: { key: 'hero_banner', value: "https://images.unsplash.com/photo-1492691523567-61125c857db3?q=80&w=2070" },
  });

  // Seed info
  const info = [
    { key: 'about_title', value: 'ОБО МНЕ' },
    { key: 'about_text_1', value: 'Создаю кинематографичные истории, в которых каждый кадр наполнен жизнью и смыслом. Мой стиль — это минимализм, естественный свет и искренние эмоции.' },
    { key: 'about_text_2', value: 'Я верю, что красота кроется в деталях: случайном взгляде, легком движении или тихой улыбке. Моя задача как фотографа — поймать этот момент и сохранить его для вас в первозданном виде.' },
    { key: 'stats_photos', value: '850+' },
    { key: 'stats_awards', value: '24+' },
    { key: 'stats_clients', value: '420+' },
    { key: 'stats_moments', value: '5000+' },
  ];

  for (const item of info) {
    await prisma.info.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  console.log('Aesthetic seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
