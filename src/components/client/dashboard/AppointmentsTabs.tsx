
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import type { Appointment } from '@/types/appointment';

interface AppointmentsTabsProps {
  appointments: Appointment[];
  pendingAppointments: Appointment[];
  completedAppointments: Appointment[];
  cancelledAppointments: Appointment[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Pendente</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Confirmado</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Concluído</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelado</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

const AppointmentRow = ({ appointment }: { appointment: Appointment }) => {
  const { date, time } = formatDateTime(appointment.scheduled_at);
  
  return (
    <TableRow>
      <TableCell>{date}</TableCell>
      <TableCell>{time}</TableCell>
      <TableCell>{appointment.services?.name || 'Consulta não especificada'}</TableCell>
      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/client/appointments/${appointment.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Detalhes
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

const EmptyState = () => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento encontrado</h3>
    <p className="mt-1 text-sm text-gray-500">
      Agende sua primeira consulta para começar.
    </p>
    <div className="mt-6">
      <Button asChild>
        <Link to="/client/booking">Agendar consulta</Link>
      </Button>
    </div>
  </div>
);

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
          Acompanhe todos os seus agendamentos de consultoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({appointments.length})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({pendingAppointments.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídos ({completedAppointments.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({cancelledAppointments.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {appointments.length > 0 ? (
              <Table>
                <TableCaption>Lista de todos os seus agendamentos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                  ))}
                </TableBody>
              </Table>
            ) : <EmptyState />}
          </TabsContent>
          <TabsContent value="pending">
            {pendingAppointments.length > 0 ? (
              <Table>
                <TableCaption>Lista dos seus agendamentos pendentes</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAppointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento pendente</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Todos os seus agendamentos estão confirmados ou concluídos.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed">
            {completedAppointments.length > 0 ? (
              <Table>
                <TableCaption>Lista dos seus agendamentos concluídos</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedAppointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento concluído</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Você ainda não tem agendamentos concluídos.
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="cancelled">
            {cancelledAppointments.length > 0 ? (
              <Table>
                <TableCaption>Lista dos seus agendamentos cancelados</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelledAppointments.map(appointment => (
                    <AppointmentRow key={appointment.id} appointment={appointment} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">Nenhum agendamento cancelado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Você não tem agendamentos cancelados.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTabs;
