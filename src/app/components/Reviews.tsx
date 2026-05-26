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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
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

        <div className="space-y-12">
          {loading ? (
            <p className="text-center text-gray-400 uppercase text-xs tracking-widest">Загрузка отзывов...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic text-center py-12 border-y">Пока нет отзывов.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              {reviews.map((review) => (
                <div key={review.id} className="relative group">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-black text-black" : "text-gray-200"}
                      />
                    ))}
                  </div>
                  <p className="text-xl text-gray-700 font-light italic leading-relaxed mb-6">
                    "{review.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium uppercase tracking-[0.2em]">
                      {review.name}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
