import { motion } from "motion/react";
import { Mail, Phone, Instagram, MapPin } from "lucide-react";

export function Contact() {
  const contactInfo = [
    { icon: Mail, label: "Email", value: "photo@example.com" },
    { icon: Phone, label: "Телефон", value: "+7 (999) 123-45-67" },
    { icon: Instagram, label: "Instagram", value: "@photographer" },
    { icon: MapPin, label: "Локация", value: "Москва, Россия" },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-light text-center mb-12 tracking-wider"
        >
          КОНТАКТЫ
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <info.icon className="w-6 h-6 text-gray-700" />
              <div>
                <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                  {info.label}
                </div>
                <div className="text-gray-900">{info.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 p-8"
        >
          <h3 className="text-2xl font-light mb-6 tracking-wider">
            ОТПРАВИТЬ СООБЩЕНИЕ
          </h3>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Имя"
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Тема"
              className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <textarea
              placeholder="Сообщение"
              rows={6}
              className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full bg-black text-white px-8 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Отправить
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
