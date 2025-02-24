
import { Link } from "react-router-dom";
import {
  Users,
  Settings,
  Calendar,
  BarChart,
  Database,
  ChevronRight,
  BriefcaseIcon,
  UserCog,
  CalendarClock,
  LogOut
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar"
      });
    }
  };

  const menuItems = [
    {
      title: "Agendamentos",
      icon: CalendarClock,
      path: "/manager-admin/agendamentos",
      description: "Gerencie os agendamentos",
      badge: "Principal",
    },
    {
      title: "Time",
      icon: BriefcaseIcon,
      path: "/manager-admin/time",
      description: "Gerencie os membros do time",
    },
    {
      title: "Serviços",
      icon: Database,
      path: "/manager-admin/servicos",
      description: "Configure os serviços oferecidos",
    },
    {
      title: "Analytics",
      icon: BarChart,
      path: "/manager-admin/analytics",
      description: "Visualize estatísticas e relatórios",
    },
    {
      title: "Clientes",
      icon: Users,
      path: "/manager-admin/usuarios",
      description: "Gerencie os clientes cadastrados",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/manager-admin/configuracoes",
      description: "Configure as opções do sistema",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {profile?.full_name}</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe, serviços e acompanhe as métricas do sistema
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-primary hover:underline">
                  Acessar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
