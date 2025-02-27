
import { useNavigate } from "react-router-dom";
import Benefits from "@/components/sections/Benefits";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import TeamSection from "@/components/sections/TeamSection";
import ContactSection from "@/components/sections/ContactSection";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  const navigate = useNavigate();

  try {
    return (
      <div className="min-h-screen">
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
  } catch (error) {
    console.error("Erro ao renderizar a página inicial:", error);
    return (
      <div className="min-h-screen flex items-center justify-center flex-col p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar a página</h1>
        <p className="text-gray-600 mb-6">Houve um problema ao carregar o conteúdo. Por favor, tente novamente mais tarde.</p>
        <button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded">
          Tentar novamente
        </button>
      </div>
    );
  }
};

export default Index;
