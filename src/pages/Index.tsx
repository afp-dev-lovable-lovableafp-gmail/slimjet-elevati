import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Benefits from "@/components/sections/Benefits";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import TeamSection from "@/components/sections/TeamSection";
import ContactSection from "@/components/sections/ContactSection";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>ElevaTI - Tecnologia para Negócios</title>
        <meta name="description" content="Soluções de tecnologia para impulsionar o seu negócio. Conheça nossos serviços de consultoria, desenvolvimento e suporte." />
      </Helmet>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <ServicesSection />
        <TeamSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
