import { motion } from "motion/react";
import { Mail, Phone, Send, MapPin } from "lucide-react";
import { useState } from "react";
import axios from "axios";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const contactInfo = [
    { icon: Mail, label: "Email", value: "TheTeaLordIsInvincible@yandex.ru", href: "mailto:TheTeaLordIsInvincible@yandex.ru" },
    { icon: Phone, label: "Телефон", value: "+7 (918) 104-13-55", href: "tel:+79181041355" },
    { icon: Send, label: "Telegram", value: "@TheTeaLordIsInvincible", href: "https://t.me/TheTeaLordIsInvincible" },
    { icon: MapPin, label: "Локация", value: "Сочи, Россия", href: "https://yandex.ru/maps/?text=Сочи" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/api/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-light text-center mb-10 md:mb-12 tracking-wider"
        >
          КОНТАКТЫ
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
          {contactInfo.map((info, index) => (
            <motion.a
              href={info.href}
              target={info.label === "Telegram" || info.label === "Локация" ? "_blank" : undefined}
              rel="noopener noreferrer"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-5 md:p-6 bg-gray-50 hover:bg-black hover:text-white transition-all duration-300 group"
            >
              <info.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
              <div>
                <div className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-gray-300">
                  {info.label}
                </div>
                <div className="text-sm md:text-lg break-all font-light">{info.value}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 p-6 md:p-8"
        >
          <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wider">
            ОТПРАВИТЬ СООБЩЕНИЕ
          </h3>
          {status === "success" ? (
            <div className="bg-green-100 text-green-700 p-4 mb-6 text-sm">
              Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Тема"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors"
                required
              />
              <textarea
                name="message"
                placeholder="Сообщение"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-black transition-colors resize-none"
                required
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-black text-white px-8 py-4 uppercase text-xs md:text-sm tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {status === "sending" ? "Отправка..." : "Отправить"}
              </button>
              {status === "error" && (
                <p className="text-red-500 text-xs uppercase tracking-tighter">Ошибка при отправке. Попробуйте позже.</p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
