import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { X } from "lucide-react";
import axios from "axios";

interface Photo {
  id: number;
  url: string;
  category: string;
  description?: string;
}

interface Category {
  id: number;
  name: string;
}

export function Gallery() {
  const [galleryImages, setGalleryImages] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>(["Все"]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Все");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, categoriesRes] = await Promise.all([
          axios.get("/api/photos"),
          axios.get("/api/categories")
        ]);
        
        const photosData = Array.isArray(photosRes.data) ? photosRes.data : [];
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
        
        setGalleryImages(photosData);
        const catNames = ["Все", ...categoriesData.map((c: Category) => c.name)];
        setCategories(catNames);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredImages = filter === "Все"
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  if (loading) return <div className="py-20 text-center">Загрузка...</div>;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-light text-center mb-12 tracking-wider"
        >
          ПОРТФОЛИО
        </motion.h2>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-all ${
                filter === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Masonry columnsCount={3} gutter="1rem">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="cursor-pointer overflow-hidden group"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.category}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </Masonry>
      </div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Enlarged"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      )}
    </section>
  );
}
