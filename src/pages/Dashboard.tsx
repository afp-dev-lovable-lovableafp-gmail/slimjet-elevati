
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardSection from "@/components/sections/DashboardSection";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();

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

  return (
    <>
      <Helmet>
        <title>ElevaTI - Dashboard</title>
        <meta name="description" content="Gerencie seus agendamentos e acesse seus serviços na ElevaTI." />
      </Helmet>
      <DashboardSection />
    </>
  );
};

export default Dashboard;
