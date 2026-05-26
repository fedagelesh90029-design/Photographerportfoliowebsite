import { motion } from "motion/react";
import { Camera, Award, Users, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import avatar from "../../assets/avatar.jpg";

export function About() {
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get("/api/info");
        setInfo(response.data);
      } catch (error) {
        console.error("Error fetching info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const stats = [
    { icon: Camera, value: info.stats_photos || "30+", label: "Фотосессий" },
    { icon: Heart, value: info.stats_moments || "1000+", label: "Красивых моментов" },
    { icon: Users, value: info.stats_clients || "30+", label: "Довольных клиентов" },
    { icon: Award, value: info.stats_creative || "10+", label: "Творческих проектов" },
  ];

  if (loading) return null;

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
              src={avatar}
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
              {info.about_title || "ОБО МНЕ"}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {info.about_text_1}
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              {info.about_text_2}
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
