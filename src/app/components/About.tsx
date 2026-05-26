import { motion } from "motion/react";
import { Camera, Award, Users, Heart } from "lucide-react";

export function About() {
  const stats = [
    { icon: Camera, value: "500+", label: "Фотосессий" },
    { icon: Award, value: "15+", label: "Наград" },
    { icon: Users, value: "300+", label: "Довольных клиентов" },
    { icon: Heart, value: "1000+", label: "Красивых моментов" },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1526707821106-6428ecac1698?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Фотограф"
              className="w-full h-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-wider">
              ОБО МНЕ
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Я профессиональный фотограф с более чем 10-летним опытом работы.
              Моя страсть — запечатлевать искренние эмоции и создавать
              визуальные истории, которые останутся с вами навсегда.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Специализируюсь на портретной, свадебной и модной фотографии.
              Каждая фотосессия для меня — это уникальная возможность
              раскрыть красоту момента и создать настоящее произведение искусства.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-white"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-gray-700" />
                  <div className="text-3xl font-light mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
