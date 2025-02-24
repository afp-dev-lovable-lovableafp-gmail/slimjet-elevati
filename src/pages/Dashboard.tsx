
import { Helmet } from "react-helmet";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, UserCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { WelcomeHeader } from "@/components/sections/dashboard/WelcomeHeader";
import { FeatureCard } from "@/components/sections/dashboard/FeatureCard";
import { BookingCTA } from "@/components/sections/dashboard/BookingCTA";

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

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
    <>
      <Helmet>
        <title>ElevaTI - Dashboard</title>
        <meta 
          name="description" 
          content="Gerencie seus agendamentos e acesse seus serviços na ElevaTI." 
        />
      </Helmet>
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

          <BookingCTA onBookNow={() => navigate("/booking")} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
