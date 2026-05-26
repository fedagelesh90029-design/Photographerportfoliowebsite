import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface HeroProps {
  onScrollToPortfolio: () => void;
}

export function Hero({ onScrollToPortfolio }: HeroProps) {
  const [bannerUrl, setBannerUrl] = useState("https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get("/api/settings/hero_banner");
        if (response.data) setBannerUrl(response.data.value);
      } catch (error) {
        console.error("Error fetching hero banner:", error);
      }
    };
    fetchBanner();
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <img
          src={bannerUrl}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <div className="relative z-10 text-center text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl md:text-8xl font-extralight tracking-[0.2em] mb-6"
        >
          ИМЯ ФАМИЛИЯ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-lg md:text-xl font-light tracking-widest uppercase mb-12"
        >
          Профессиональный фотограф
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onScrollToPortfolio}
          className="group flex items-center gap-3 mx-auto px-8 py-4 border border-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
        >
          Смотреть портфолио
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-12 bg-white/50" />
      </motion.div>
    </section>
  );
}
