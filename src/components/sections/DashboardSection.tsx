
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Calendar, UserCircle, PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";
import { FeatureCard } from "./dashboard/FeatureCard";
import { BookingCTA } from "./dashboard/BookingCTA";

const DashboardSection = () => {
  const { signOut, profile } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await queryClient.clear();
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Meus Agendamentos",
      description: "Visualize e gerencie seus agendamentos",
      action: "Ver Agendamentos",
      onClick: () => navigate("/appointments")
    },
    {
      icon: UserCircle,
      title: "Meu Perfil",
      description: "Atualize suas informações pessoais",
      action: "Editar Perfil",
      onClick: () => navigate("/perfil")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <WelcomeHeader 
          profile={profile} 
          onSignOut={handleSignOut} 
        />

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
            />
          ))}
        </div>

        <BookingCTA onBookingClick={() => navigate("/booking")} />
      </div>
    </div>
  );
};

export default DashboardSection;
