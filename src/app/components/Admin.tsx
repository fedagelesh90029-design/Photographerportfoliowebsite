import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Upload, Image as ImageIcon, FolderTree, MessageSquare, Check, Send, Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

export function Admin() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [siteInfo, setSiteInfo] = useState<Record<string, string>>({});
  
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoCategory, setNewPhotoCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const token = localStorage.getItem("admin_token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, c, r, i] = await Promise.all([
        axios.get("/api/photos"),
        axios.get("/api/categories"),
        axios.get("/api/admin/reviews", authHeader),
        axios.get("/api/info"),
      ]);
      setPhotos(p.data);
      setCategories(c.data);
      setReviews(r.data);
      setSiteInfo(i.data);
      if (c.data.length > 0 && !newPhotoCategory) setNewPhotoCategory(c.data[0].name);
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при загрузке данных");
    }
  };

  const handleUploadPhoto = async () => {
    if (!newPhotoFile) {
      toast.error("Выберите файл");
      return;
    }
    const formData = new FormData();
    formData.append("image", newPhotoFile);

    try {
      const uploadRes = await axios.post("/api/upload", formData, authHeader);
      const url = uploadRes.data.url;
      await axios.post("/api/photos", { url, category: newPhotoCategory }, authHeader);
      setNewPhotoFile(null);
      fetchData();
      toast.success("Фото успешно загружено");
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Ошибка при загрузке фото");
    }
  };

  const handleDeletePhoto = async (id: number) => {
    try {
      await axios.delete(`/api/photos/${id}`, authHeader);
      fetchData();
      toast.success("Фото удалено");
    } catch (err) {
      toast.error("Ошибка при удалении");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      await axios.post("/api/categories", { name: newCategoryName }, authHeader);
      setNewCategoryName("");
      fetchData();
      toast.success("Категория добавлена");
    } catch (err) {
      toast.error("Ошибка при добавлении категории");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await axios.delete(`/api/categories/${id}`, authHeader);
      fetchData();
      toast.success("Категория удалена");
    } catch (err) {
      toast.error("Ошибка при удалении категории");
    }
  };

  const handleApproveReview = async (id: number) => {
    try {
      await axios.put(`/api/reviews/${id}/approve`, {}, authHeader);
      fetchData();
      toast.success("Отзыв одобрен");
    } catch (err) {
      toast.error("Ошибка при одобрении");
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await axios.delete(`/api/reviews/${id}`, authHeader);
      fetchData();
      toast.success("Отзыв удален");
    } catch (err) {
      toast.error("Ошибка при удалении");
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage) return;
    try {
      const res = await axios.post("/api/broadcast", { message: broadcastMessage }, authHeader);
      toast.success(`Сообщение отправлено ${res.data.count} подписчикам`);
      setBroadcastMessage("");
    } catch (err) {
      toast.error("Ошибка при отправке рассылки");
    }
  };

  const handleUpdateInfo = async (key: string, value: string) => {
    try {
      await axios.post("/api/info", { key, value }, authHeader);
      setSiteInfo(prev => ({ ...prev, [key]: value }));
      toast.success("Настройка сохранена");
    } catch (err) {
      toast.error("Ошибка при сохранении");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-light tracking-[0.2em] uppercase">Управление сайтом</h1>
            <Button onClick={handleLogout} variant="outline" size="sm" className="text-[10px] uppercase tracking-widest h-8 rounded-none">Выйти</Button>
          </div>
          <Button variant="ghost" asChild className="text-xs uppercase tracking-widest">
            <a href="/">На сайт</a>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 space-x-8">
            <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 text-xs uppercase tracking-widest">
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 text-xs uppercase tracking-widest">
              Отзывы
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 text-xs uppercase tracking-widest">
              Рассылка (TG)
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-4 text-xs uppercase tracking-widest">
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="shadow-sm border-none lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <FolderTree size={16} /> Категории (Классы)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Название..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="rounded-none"
                    />
                    <Button onClick={handleAddCategory} size="icon" className="bg-black shrink-0">
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 flex items-center gap-2 border-none rounded-sm">
                        {cat.name}
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <Upload size={16} /> Загрузить фото с компьютера
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider">Файл</label>
                      <Input
                        type="file"
                        onChange={(e) => setNewPhotoFile(e.target.files ? e.target.files[0] : null)}
                        className="rounded-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider">Класс</label>
                      <select
                        value={newPhotoCategory}
                        onChange={(e) => setNewPhotoCategory(e.target.value)}
                        className="w-full h-10 px-3 py-2 border rounded-none text-sm outline-none focus:ring-1 focus:ring-black"
                      >
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <Button 
                      onClick={handleUploadPhoto} 
                      className="md:col-span-2 bg-black hover:bg-gray-800 text-white rounded-none py-6 uppercase tracking-[0.2em] transition-all"
                      disabled={!newPhotoFile || !newPhotoCategory}
                    >
                      <Upload size={18} className="mr-2" /> Опубликовать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest">Текущее портфолио ({photos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative aspect-[3/4] group overflow-hidden bg-gray-100">
                      <img src={photo.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <Badge className="mb-4 bg-white text-black hover:bg-white rounded-none text-[10px] uppercase">
                          {photo.category}
                        </Badge>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="rounded-full h-8 w-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={16} /> Модерация отзывов
                </CardTitle>
                <CardDescription className="text-xs uppercase">Одобряйте или удаляйте отзывы, оставленные на сайте</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.length === 0 && <p className="text-center py-12 text-gray-400 uppercase text-xs">Отзывов пока нет</p>}
                  {reviews.map((review) => (
                    <div key={review.id} className={`p-6 border rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${review.approved ? "bg-white" : "bg-orange-50/50 border-orange-100"}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-sm">{review.name}</span>
                          {!review.approved && <Badge className="bg-orange-500 text-[8px] uppercase tracking-tighter h-4 px-1">Новый</Badge>}
                        </div>
                        <p className="text-xs text-gray-600 italic">"{review.content}"</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!review.approved && (
                          <Button onClick={() => handleApproveReview(review.id)} size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-none h-8 text-[10px] uppercase tracking-widest">
                            <Check size={12} className="mr-1" /> Одобрить
                          </Button>
                        )}
                        <Button onClick={() => handleDeleteReview(review.id)} variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50 rounded-none h-8 text-[10px] uppercase tracking-widest">
                          <Trash2 size={12} className="mr-1" /> Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="broadcast" className="space-y-6">
            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                  <Send size={16} /> Telegram Рассылка
                </CardTitle>
                <CardDescription className="text-xs uppercase">Отправить сообщение всем, кто запустил вашего бота</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Введите текст сообщения..." 
                  className="min-h-[200px] rounded-none border-gray-200"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
                <Button 
                  onClick={handleBroadcast} 
                  className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-6 uppercase tracking-[0.2em]"
                  disabled={!broadcastMessage}
                >
                  <Send size={18} className="mr-2" /> Отправить всем подписчикам
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-sm border-none">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <SettingsIcon size={16} /> Контактная информация
                  </CardTitle>
                  <CardDescription className="text-xs uppercase">Эти данные отображаются в разделе контактов и футере</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { key: "email", label: "Email", icon: "📧" },
                    { key: "phone", label: "Телефон", icon: "📞" },
                    { key: "telegram", label: "Telegram (username)", icon: "✈️" },
                    { key: "location", label: "Локация", icon: "📍" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider flex items-center gap-2">
                        {item.icon} {item.label}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={siteInfo[item.key] || ""}
                          onChange={(e) => setSiteInfo(prev => ({ ...prev, [item.key]: e.target.value }))}
                          className="rounded-none border-gray-200"
                        />
                        <Button 
                          onClick={() => handleUpdateInfo(item.key, siteInfo[item.key] || "")} 
                          size="icon" 
                          className="bg-black shrink-0"
                        >
                          <Save size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-none">
                <CardHeader>
                  <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={16} /> Обо мне и Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider">Заголовок</label>
                      <Input 
                        value={siteInfo["about_title"] || ""}
                        onChange={(e) => setSiteInfo(prev => ({ ...prev, ["about_title"]: e.target.value }))}
                        className="rounded-none border-gray-200"
                      />
                      <Button onClick={() => handleUpdateInfo("about_title", siteInfo["about_title"] || "")} size="sm" className="w-full bg-black text-white rounded-none">Сохранить заголовок</Button>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider">Параграф 1</label>
                      <Textarea 
                        value={siteInfo["about_text_1"] || ""}
                        onChange={(e) => setSiteInfo(prev => ({ ...prev, ["about_text_1"]: e.target.value }))}
                        className="min-h-[80px] rounded-none border-gray-200"
                      />
                      <Button onClick={() => handleUpdateInfo("about_text_1", siteInfo["about_text_1"] || "")} size="sm" className="w-full bg-black text-white rounded-none">Сохранить параграф 1</Button>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase text-gray-400 tracking-wider">Параграф 2</label>
                      <Textarea 
                        value={siteInfo["about_text_2"] || ""}
                        onChange={(e) => setSiteInfo(prev => ({ ...prev, ["about_text_2"]: e.target.value }))}
                        className="min-h-[80px] rounded-none border-gray-200"
                      />
                      <Button onClick={() => handleUpdateInfo("about_text_2", siteInfo["about_text_2"] || "")} size="sm" className="w-full bg-black text-white rounded-none">Сохранить параграф 2</Button>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      {[
                        { key: "stats_photos", label: "Фотосессий" },
                        { key: "stats_moments", label: "Моментов" },
                        { key: "stats_clients", label: "Клиентов" },
                        { key: "stats_creative", label: "Проектов" },
                      ].map(stat => (
                        <div key={stat.key} className="space-y-1">
                          <label className="text-[8px] uppercase text-gray-400 tracking-tighter">{stat.label}</label>
                          <div className="flex gap-1">
                            <Input 
                              value={siteInfo[stat.key] || ""}
                              onChange={(e) => setSiteInfo(prev => ({ ...prev, [stat.key]: e.target.value }))}
                              className="h-8 text-xs rounded-none border-gray-200"
                            />
                            <Button onClick={() => handleUpdateInfo(stat.key, siteInfo[stat.key] || "")} size="icon" className="h-8 w-8 bg-black shrink-0"><Save size={12}/></Button>
                          </div>
                        </div>
                      ))}
                   </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
