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
              alt="Антон"
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wider">
              {info.about_title || "ОБО МНЕ"}
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed font-light">
              <p className="text-lg text-black font-normal">
                Меня зовут Антон, я фотограф в Сочи.
              </p>
              
              <p>
                Главное в моей работе — показать человека живым, сильным, настоящим. Я снимаю портреты, в которых есть объём, характер, настроение. Мне нравится работать со светом и тенью, подмечать детали и создавать кадры, на которые хочется смотреть снова.
              </p>
              
              <p>
                Да, иногда это уходит в дарк-эстетику или фентези, но чаще — это просто честные, глубокие портреты людей без наигранной улыбки.
              </p>
              
              <p>
                Я также профессионально работаю с бизнесом: предметная и фуд-съёмки, интерьеры, экстерьеры, деловые портреты сотрудников и владельцев — я знаю, как заставить выглядеть фото дорогими. Остаюсь собой везде: внимательным к деталям и немного художником в душе.
              </p>
              
              <p className="pt-4 text-sm uppercase tracking-widest text-gray-500">
                Локации: Адлерский, Хостинский, Центральный районы Сочи, Красная Поляна и ФТ Сириус.
              </p>
              
              <div className="pt-8">
                <p className="italic text-gray-600 mb-4">Хотите попробовать? Напишите мне — обсудим идеи без давления и спешки, разработаем образ и реализуем его вместе!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
