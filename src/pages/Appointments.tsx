
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackButton } from "@/components/ui/back-button";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Appointments = () => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>ElevaTI - Meus Agendamentos</title>
        <meta name="description" content="Visualize e gerencie seus agendamentos na ElevaTI." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-2xl font-semibold mb-6">Meus Agendamentos</h1>
        <AppointmentsList />
      </div>
    </>
  );
};

export default Appointments;
