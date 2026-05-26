import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock } from "lucide-react";

interface LoginProps {
  onLogin: (token: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });
      onLogin(res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="bg-black p-3 rounded-full mb-4">
            <Lock className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-light tracking-widest uppercase">Вход в админ-панель</CardTitle>
          <p className="text-sm text-gray-500 uppercase tracking-tighter">Введите ваши данные для доступа</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Логин</label>
              <Input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-none border-gray-200 focus:border-black transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400">Пароль</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-none border-gray-200 focus:border-black transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-xs uppercase">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-6 uppercase tracking-widest transition-all"
              disabled={loading}
            >
              {loading ? "Загрузка..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
