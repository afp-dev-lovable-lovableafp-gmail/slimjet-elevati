import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackButton } from "@/components/ui/back-button";
import ClientAppointmentsList from "@/components/client/appointments/ClientAppointmentsList";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAppointmentQueries } from "@/hooks/appointments/useAppointmentQueries";

const Appointments = () => {
  const { user, loading } = useAuth();
  const { useUserAppointments } = useAppointmentQueries();
  const { data: appointments, isLoading: loadingAppointments } = useUserAppointments();

  const isLoading = loading || loadingAppointments;

  if (isLoading) {
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
        <ClientAppointmentsList appointments={appointments || []} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Appointments;
