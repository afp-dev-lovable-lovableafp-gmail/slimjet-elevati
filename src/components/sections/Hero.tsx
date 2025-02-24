
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const heroContent = [
  {
    image: "/images/hero1.jpeg",
    title: "Transformando ideias em realidade digital",
    description: "Soluções tecnológicas personalizadas para impulsionar seu negócio ao próximo nível"
  },
  {
    image: "/images/hero2.jpeg",
    title: "Inovação e excelência em TI",
    description: "Desenvolvimento de software, consultoria e suporte técnico especializado"
  },
  {
    image: "/images/hero3.jpeg",
    title: "Equipe especializada",
    description: "Profissionais qualificados prontos para atender suas necessidades tecnológicas"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  return (
    <section className="relative h-screen flex items-end">
      {heroContent.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/50" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full z-10"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm p-12 sm:p-16 rounded-t-lg">
            <motion.h1
              key={`title-${currentSlide}`}
              {...slideTransition}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-center"
            >
              {heroContent[currentSlide].title}
            </motion.h1>

            <motion.p
              key={`desc-${currentSlide}`}
              {...slideTransition}
              className="text-lg sm:text-xl text-gray-100 mb-8 text-center"
            >
              {heroContent[currentSlide].description}
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary rounded-md hover:bg-secondary hover:text-[rgb(15,23,42)] transition-colors"
              >
                Agendar Consulta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/servicos"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-transparent border-2 border-white rounded-md hover:bg-white/10 transition-colors"
              >
                Nossos Serviços
              </Link>
            </div>

            <div className="flex justify-center space-x-2 mt-8">
              {heroContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-white" : "bg-gray-400/50"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
