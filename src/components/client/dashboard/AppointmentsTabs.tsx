import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import type { Appointment } from '@/types/appointment';
import { ClientAppointmentsList } from '@/components/client/appointments';

interface AppointmentsTabsProps {
  appointments: Appointment[];
  pendingAppointments: Appointment[];
  completedAppointments: Appointment[];
  cancelledAppointments: Appointment[];
}

const AppointmentsTabs = ({ 
  appointments, 
  pendingAppointments, 
  completedAppointments, 
  cancelledAppointments 
}: AppointmentsTabsProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Seus Agendamentos</CardTitle>
        <CardDescription>
          Gerencie suas consultas e veja o histórico de atendimentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0">
              {appointments.length > 0 ? (
                <ClientAppointmentsList appointments={appointments} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              {pendingAppointments.length > 0 ? (
                <ClientAppointmentsList appointments={pendingAppointments} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            <TabsContent value="completed" className="m-0">
              {completedAppointments.length > 0 ? (
                <ClientAppointmentsList appointments={completedAppointments} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
            <TabsContent value="cancelled" className="m-0">
              {cancelledAppointments.length > 0 ? (
                <ClientAppointmentsList appointments={cancelledAppointments} />
              ) : (
                <EmptyState />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <div className="text-center py-8">
    <FileText className="mx-auto h-12 w-12 text-gray-300" />
    <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum agendamento</h3>
    <p className="mt-1 text-sm text-gray-500">Você ainda não tem agendamentos registrados.</p>
    <div className="mt-6">
      <Button asChild>
        <Link to="/client/booking">Fazer um agendamento</Link>
      </Button>
    </div>
  </div>
);

export default AppointmentsTabs; 