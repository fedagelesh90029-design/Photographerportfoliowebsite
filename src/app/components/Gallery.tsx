import { motion } from "motion/react";
import { useState } from "react";
import Masonry from "react-responsive-masonry";
import { X } from "lucide-react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Портрет",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBlbGVnYW50fGVufDF8fHx8MTc3OTQ0NDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Свадьба",
  },
  {
    url: "https://images.unsplash.com/photo-1610765431323-d88c88a2b2c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzc5NTY3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Мода",
  },
  {
    url: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Портрет",
  },
  {
    url: "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBlbGVnYW50fGVufDF8fHx8MTc3OTQ0NDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Свадьба",
  },
  {
    url: "https://images.unsplash.com/photo-1590131222139-91ba5992e4ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzc5NTY3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Мода",
  },
  {
    url: "https://images.unsplash.com/photo-1606143412458-acc5f86de897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Портрет",
  },
  {
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBlbGVnYW50fGVufDF8fHx8MTc3OTQ0NDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Свадьба",
  },
  {
    url: "https://images.unsplash.com/photo-1612242879330-cd06b2696e56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzc5NTY3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Мода",
  },
  {
    url: "https://images.unsplash.com/photo-1532170579297-281918c8ae72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Портрет",
  },
  {
    url: "https://images.unsplash.com/photo-1607357910286-1ff94ac13c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBlbGVnYW50fGVufDF8fHx8MTc3OTQ0NDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Свадьба",
  },
  {
    url: "https://images.unsplash.com/photo-1641236210747-48bc43e4517f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBzdHVkaW98ZW58MXx8fHwxNzc5NTY3NDA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Мода",
  },
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Все");

  const categories = ["Все", "Портрет", "Свадьба", "Мода"];

  const filteredImages = filter === "Все"
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

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
              key={index}
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
