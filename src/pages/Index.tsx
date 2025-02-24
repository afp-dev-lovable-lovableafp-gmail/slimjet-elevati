
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Benefits from "@/components/sections/Benefits";
import Social from "@/components/sections/Social";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>ElevaTI - Consultoria em Tecnologia</title>
        <meta
          name="description"
          content="Elevamos sua empresa através da tecnologia. Consultoria especializada em desenvolvimento, cloud, segurança e transformação digital."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Services />
          <Benefits />
          <Social />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
