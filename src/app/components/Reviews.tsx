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
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/reviews");
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/reviews", newReview);
      setNewReview({ name: "", content: "", rating: 5 });
      setShowForm(false);
      // Notify user that review is pending moderation
      alert("Спасибо! Ваш отзыв отправлен на модерацию.");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
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

        <div className="flex justify-center mb-16">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-3 border border-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
          >
            {showForm ? "Закрыть форму" : "Оставить отзыв"}
          </button>
        </div>

        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-20 bg-gray-50 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Ваше имя</label>
                  <input 
                    type="text" 
                    required
                    value={newReview.name}
                    onChange={e => setNewReview({...newReview, name: e.target.value})}
                    className="w-full p-3 bg-white border border-gray-100 outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400">Оценка</label>
                  <div className="flex gap-2 py-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        size={20} 
                        className={`cursor-pointer ${star <= newReview.rating ? "fill-black text-black" : "text-gray-200"}`}
                        onClick={() => setNewReview({...newReview, rating: star})}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Ваш отзыв</label>
                <textarea 
                  required
                  rows={4}
                  value={newReview.content}
                  onChange={e => setNewReview({...newReview, content: e.target.value})}
                  className="w-full p-3 bg-white border border-gray-100 outline-none focus:border-black transition-colors resize-none"
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
              >
                {submitting ? "Отправка..." : "Опубликовать отзыв"}
              </button>
            </form>
          </motion.div>
        )}

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
