
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Calendar, UserCircle, PlusCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo(a), {profile?.full_name}
              </h1>
              <p className="text-gray-600">
                Gerencie seus agendamentos e seus dados
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 transition-all hover:shadow-lg">
              <div className="flex flex-col h-full">
                <div className="p-2 bg-blue-100 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h2>
                <p className="text-gray-600 mb-6 flex-grow">
                  {feature.description}
                </p>
                <Button 
                  onClick={feature.onClick}
                  className="w-full justify-center"
                >
                  {feature.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Agende uma Reunião
              </h2>
              <p className="text-blue-100">
                Converse com nossos especialistas e descubra como podemos ajudar seu negócio
              </p>
            </div>
            <Button
              onClick={() => navigate("/booking")}
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-5 w-5" />
              Agendar Agora
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
