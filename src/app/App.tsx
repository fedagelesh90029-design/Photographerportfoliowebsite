import { useRef, useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Gallery } from "./components/Gallery";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Reviews } from "./components/Reviews";
import { Admin } from "./components/Admin";
import { Login } from "./components/Login";
import { Toaster } from "sonner";

export default function App() {
  const [isAdminPath, setIsAdminPath] = useState(window.location.pathname === "/admin");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("admin_token"));

  useEffect(() => {
    // Basic connectivity check
    axios.get("/api/health")
      .then(res => console.log("API Status:", res.data))
      .catch(err => console.error("API Unreachable:", err));

    const handlePopState = () => {
      setIsAdminPath(window.location.pathname === "/admin");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem("admin_token", token);
    setIsAuthenticated(true);
  };

  const portfolioRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    if (isAdminPath) {
      window.history.pushState({}, "", "/");
      setIsAdminPath(false);
      // Wait for render
      setTimeout(() => scrollToSection(section), 100);
      return;
    }

    const refs = {
      home: null,
      portfolio: portfolioRef,
      about: aboutRef,
      contact: contactRef,
      reviews: reviewsRef,
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

  if (isAdminPath) {
    return (
      <>
        <Toaster position="top-center" />
        {isAuthenticated ? <Admin /> : <Login onLogin={handleLogin} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-center" />
      <Navigation onNavigate={scrollToSection} />
      <Hero onScrollToPortfolio={scrollToPortfolio} />
      <div ref={portfolioRef}>
        <Gallery />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={reviewsRef}>
        <Reviews />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
