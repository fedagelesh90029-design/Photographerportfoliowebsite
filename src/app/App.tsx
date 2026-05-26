import { useRef } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refs = {
      home: null,
      portfolio: portfolioRef,
      about: aboutRef,
      contact: contactRef,
    };

    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const ref = refs[section as keyof typeof refs];
      ref?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToPortfolio = () => {
    portfolioRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={scrollToSection} />
      <Hero onScrollToPortfolio={scrollToPortfolio} />
      <div ref={portfolioRef}>
        <Gallery />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
      <Footer />
    </div>
  );
}