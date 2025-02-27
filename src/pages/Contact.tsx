import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>ElevaTI - Contato</title>
        <meta name="description" content="Entre em contato conosco. Estamos prontos para ajudar você com soluções em tecnologia." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
