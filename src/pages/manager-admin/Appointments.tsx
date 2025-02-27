import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAdminAppointments } from '@/hooks/admin/useAdminAppointments';
import type { AppointmentStatus } from '@/types/appointment';
import AdminAppointmentCard from '@/components/admin/AdminAppointmentCard';

const AppointmentsAdmin = () => {
  const { appointments, isLoading, error, updateAppointmentStatus } = useAdminAppointments();

  useEffect(() => {
    document.title = 'Gerenciar Agendamentos | Admin';
  }, []);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointmentStatus.mutateAsync({ id, status });
      toast.success(`Status do agendamento atualizado para ${status}`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do agendamento");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-80 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar agendamentos</h3>
          <p className="text-gray-600 mt-2">Tente novamente mais tarde.</p>
        </div>
      </AdminLayout>
    );
  }

  const pendingAppointments = appointments?.filter(a => a.status === 'pending') || [];
  const confirmedAppointments = appointments?.filter(a => a.status === 'confirmed') || [];
  const completedAppointments = appointments?.filter(a => a.status === 'completed') || [];
  const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled') || [];

  return (
    <AdminLayout>
      <Helmet>
        <title>ElevaTI - Gerenciar Agendamentos</title>
        <meta name="description" content="Gerencie os agendamentos da plataforma ElevaTI" />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Agendamentos</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe e gerencie os agendamentos da plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>
            Visualize e atualize o status dos agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos ({appointments?.length || 0})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({pendingAppointments.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmados ({confirmedAppointments.length})</TabsTrigger>
              <TabsTrigger value="completed">Concluídos ({completedAppointments.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados ({cancelledAppointments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {appointments && appointments.length > 0 ? (
                appointments.map(appointment => (
                  <AdminAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento encontrado</h3>
                </div>
              )}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map(appointment => (
                  <AdminAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento pendente</h3>
                </div>
              )}
            </TabsContent>
            <TabsContent value="confirmed" className="space-y-4">
              {confirmedAppointments.length > 0 ? (
                confirmedAppointments.map(appointment => (
                  <AdminAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento confirmado</h3>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              {completedAppointments.length > 0 ? (
                completedAppointments.map(appointment => (
                  <AdminAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento concluído</h3>
                </div>
              )}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-4">
              {cancelledAppointments.length > 0 ? (
                cancelledAppointments.map(appointment => (
                  <AdminAppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento cancelado</h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AppointmentsAdmin;
