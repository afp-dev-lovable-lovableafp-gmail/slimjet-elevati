
import { Helmet } from "@/providers/helmet-provider";
import { useAuth } from "@/hooks/useAuth";
import ServicesSection from "@/components/sections/ServicesSection";
import { BackButton } from "@/components/ui/back-button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Services = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>ElevaTI - Serviços</title>
        <meta name="description" content="Conheça nossos serviços especializados em tecnologia." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {user && <div className="container mx-auto px-4 pt-8"><BackButton /></div>}
          <ServicesSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Services;
