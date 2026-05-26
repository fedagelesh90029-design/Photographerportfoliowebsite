import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onScrollToPortfolio: () => void;
}

export function Hero({ onScrollToPortfolio }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3OTU2NzQwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-light tracking-wider mb-6"
        >
          МОМЕНТ
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl font-light tracking-wide mb-12"
        >
          Создаю вечные воспоминания через объектив
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={onScrollToPortfolio}
          className="border-2 border-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all"
        >
          Смотреть портфолио
        </motion.button>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={onScrollToPortfolio}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}
