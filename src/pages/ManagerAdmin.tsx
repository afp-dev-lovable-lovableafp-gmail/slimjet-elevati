
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  ChartBar,
  FileText,
  Database,
  FileSpreadsheet,
  BarChart,
  ClipboardList,
} from "lucide-react";

const ManagerAdmin = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      description: "Visão geral do sistema",
      icon: LayoutDashboard,
      path: "/manager-admin",
    },
    {
      title: "Agendamentos",
      description: "Gerenciar agendamentos",
      icon: CalendarDays,
      path: "/manager-admin/appointments",
    },
    {
      title: "Serviços",
      description: "Gerenciar serviços oferecidos",
      icon: ClipboardList,
      path: "/manager-admin/services",
    },
    {
      title: "Equipe",
      description: "Gerenciar membros da equipe",
      icon: Users,
      path: "/manager-admin/team",
    },
    {
      title: "Analytics",
      description: "Análise de dados e métricas",
      icon: ChartBar,
      path: "/manager-admin/analytics",
    },
    {
      title: "Templates de Documentos",
      description: "Gerenciar modelos de documentos",
      icon: FileText,
      path: "/manager-admin/document-templates",
    },
    {
      title: "Campos Personalizados",
      description: "Configurar campos customizados",
      icon: Database,
      path: "/manager-admin/custom-fields",
    },
    {
      title: "Métricas Personalizadas",
      description: "Configurar métricas de análise",
      icon: BarChart,
      path: "/manager-admin/custom-metrics",
    },
    {
      title: "Relatórios Personalizados",
      description: "Criar e gerenciar relatórios",
      icon: FileSpreadsheet,
      path: "/manager-admin/custom-reports",
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      icon: Settings,
      path: "/manager-admin/settings",
    },
  ];

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card
            key={item.path}
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => navigate(item.path)}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default ManagerAdmin;
