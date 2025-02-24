
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentsList } from "@/components/admin/appointments/AppointmentsList";
import { BackButton } from "@/components/ui/back-button";
import { useAdminAppointments } from "@/hooks/admin/useAdminAppointments";

const AdminAppointments = () => {
  const {
    appointments,
    isLoading,
    handleStatusChange,
    handleDelete
  } = useAdminAppointments();

  return (
    <div className="space-y-6">
      <BackButton />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gerenciamento de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <AppointmentsList
              appointments={appointments || []}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;
