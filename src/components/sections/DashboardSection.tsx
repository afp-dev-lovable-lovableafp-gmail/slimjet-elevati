
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarIcon, CheckCircleIcon, ClockIcon, FileTextIcon } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { useServices } from '@/hooks/useServices';
import { useAppointmentQueries } from '@/hooks/appointments/useAppointmentQueries';
import WelcomeHeader from './dashboard/WelcomeHeader';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import { ScrollArea } from '@/components/ui/scroll-area';

export const DashboardSection = () => {
  const { user, profile, client, loading: authLoading } = useAuth();
  const { data: services, isLoading: loadingServices } = useServices();
  const { useUserAppointments } = useAppointmentQueries();
  const { data: appointments, isLoading: loadingAppointments } = useUserAppointments();

  useEffect(() => {
    document.title = 'Dashboard | Painel do Cliente';
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
        <p className="text-gray-600 mb-6">Você precisa estar logado para acessar esta página.</p>
        <Button asChild>
          <Link to="/login">Fazer login</Link>
        </Button>
      </div>
    );
  }

  const pendingAppointments = appointments?.filter(a => a.status === 'pending') || [];
  const completedAppointments = appointments?.filter(a => a.status === 'completed') || [];
  const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled') || [];

  const isLoading = loadingServices || loadingAppointments;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <WelcomeHeader 
        name={client?.full_name || 'Cliente'} 
        avatarUrl={client?.avatar_url} 
      />

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <ClockIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingAppointments.length === 1 
                ? 'Agendamento aguardando confirmação' 
                : 'Agendamentos aguardando confirmação'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Concluídas</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Consultas realizadas com sucesso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <>
                <div className="text-sm font-medium">
                  {formatDate(pendingAppointments[0].scheduled_at, 'PPP')}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(pendingAppointments[0].scheduled_at, 'p')}
                </p>
              </>
            ) : (
              <>
                <div className="text-sm font-medium">Nenhuma consulta agendada</div>
                <p className="text-xs text-muted-foreground">
                  Agende sua primeira consulta
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
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
                  {appointments?.length ? (
                    <AppointmentsList appointments={appointments} />
                  ) : (
                    <div className="text-center py-8">
                      <FileTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum agendamento</h3>
                      <p className="mt-1 text-sm text-gray-500">Você ainda não tem agendamentos registrados.</p>
                      <div className="mt-6">
                        <Button asChild>
                          <Link to="/schedule">Fazer um agendamento</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="pending" className="m-0">
                  {pendingAppointments.length ? (
                    <AppointmentsList appointments={pendingAppointments} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento pendente</h3>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="m-0">
                  {completedAppointments.length ? (
                    <AppointmentsList appointments={completedAppointments} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento concluído</h3>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="cancelled" className="m-0">
                  {cancelledAppointments.length ? (
                    <AppointmentsList appointments={cancelledAppointments} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-sm font-medium text-gray-900">Nenhum agendamento cancelado</h3>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
