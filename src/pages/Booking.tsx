
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingSection from "@/components/sections/BookingSection";

const Booking = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>ElevaTI - Agendar Consulta</title>
        <meta name="description" content="Agende uma consulta com nossos especialistas em tecnologia." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <BookingSection />
        <Footer />
      </div>
    </>
  );
};

export default Booking;
