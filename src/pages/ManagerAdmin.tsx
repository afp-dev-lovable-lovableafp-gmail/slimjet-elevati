
import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";
import AdminDashboard from "@/components/sections/admin/AdminDashboard";
import TeamMembers from "./manager-admin/TeamMembers";
import Services from "./manager-admin/Services";
import Analytics from "./manager-admin/Analytics";
import Users from "./manager-admin/Users";
import Settings from "./manager-admin/Settings";
import Appointments from "./manager-admin/Appointments";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const ManagerAdmin = () => {
  const { loading, isAuthenticated, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // O hook useAdminAuth já cuida do redirecionamento
  }

  return (
    <>
      <Helmet>
        <title>ElevaTI - Área Administrativa</title>
        <meta 
          name="description" 
          content="Área administrativa da ElevaTI - Gestão de serviços, time e agendamentos." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/time" element={<TeamMembers />} />
          <Route path="/servicos" element={<Services />} />
          <Route path="/agendamentos" element={<Appointments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};

export default ManagerAdmin;
