
import { Helmet } from "@/providers/helmet-provider";
import Navbar from "@/components/layout/Navbar";
import AboutSection from "@/components/sections/AboutSection";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>ElevaTI - Sobre Nós</title>
        <meta name="description" content="Conheça a história, missão e valores da ElevaTI." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AboutSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
