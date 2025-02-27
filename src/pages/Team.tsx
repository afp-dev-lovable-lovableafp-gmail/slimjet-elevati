import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TeamSection from "@/components/sections/TeamSection";
import Footer from "@/components/layout/Footer";

const Team = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleAdminAccess = () => {
    console.log("Redirecionando para área administrativa");
    navigate("/admin-auth");
  };

  return (
    <>
      <Helmet>
        <title>ElevaTI - Nosso Time</title>
        <meta 
          name="description" 
          content="Conheça os profissionais dedicados que fazem parte do time ElevaTI." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 mt-16">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={handleAdminAccess}
                className="bg-primary hover:bg-primary/90"
              >
                <Users className="mr-2 h-4 w-4" />
                Área do Time
              </Button>
            </div>
            <TeamSection />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Team;
