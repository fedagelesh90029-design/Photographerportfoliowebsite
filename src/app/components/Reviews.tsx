import { motion } from "motion/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  content: string;
  rating: number;
  createdAt: string;
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/reviews", { name, content, rating });
      setSubmitted(true);
      setName("");
      setContent("");
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-light text-center mb-12 tracking-wider"
        >
          ОТЗЫВЫ
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-light mb-6">Оставить отзыв</h3>
            {submitted ? (
              <p className="text-green-600">Спасибо за ваш отзыв! Он появится после модерации.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-all"
                  required
                />
                <textarea
                  placeholder="Ваш отзыв"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 focus:border-black outline-none transition-all h-32"
                  required
                ></textarea>
                <div className="flex items-center gap-2">
                  <span>Рейтинг:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      className={`cursor-pointer ${s <= rating ? "fill-black text-black" : "text-gray-300"}`}
                      onClick={() => setRating(s)}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 uppercase tracking-wider hover:bg-gray-800 transition-all"
                >
                  Отправить
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-light mb-6">Что говорят клиенты</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">Пока нет отзывов.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= review.rating ? "fill-black text-black" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-2">"{review.content}"</p>
                  <p className="text-sm font-semibold">{review.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
