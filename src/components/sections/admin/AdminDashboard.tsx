
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, FileIcon, UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAppointments } from '@/hooks/admin/useAdminAppointments';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AppointmentStatus } from '@/types/appointment';
import AdminAppointmentCard from '@/components/admin/AdminAppointmentCard';
import { useAuth } from '@/hooks/useAuth';

export const AdminDashboard = () => {
  const { user, profile, client } = useAuth();
  const { appointments, isLoading, updateAppointmentStatus } = useAdminAppointments();
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">("all");

  useEffect(() => {
    document.title = 'Admin Dashboard | Painel de Controle';
  }, []);

  if (!user || !profile?.is_admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
        <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    );
  }

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments?.filter(a => a.status === filterStatus);

  const pendingCount = appointments?.filter(a => a.status === "pending").length || 0;
  const confirmedCount = appointments?.filter(a => a.status === "confirmed").length || 0;
  const completedCount = appointments?.filter(a => a.status === "completed").length || 0;

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo, {client?.full_name || "Administrador"}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link to="/admin/services">
              <FileIcon className="mr-2 h-4 w-4" />
              Gerenciar Serviços
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/team">
              <UsersIcon className="mr-2 h-4 w-4" />
              Gerenciar Equipe
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
            <ClockIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingCount === 1 
                ? 'Agendamento aguardando ação' 
                : 'Agendamentos aguardando ação'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground">
              {confirmedCount === 1 
                ? 'Agendamento a ser realizado' 
                : 'Agendamentos a serem realizados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Concluídas</CardTitle>
            <CalendarIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Consultas finalizadas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gerenciar Agendamentos</CardTitle>
          <CardDescription>
            Visualize e gerencia todos os agendamentos da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(value) => setFilterStatus(value as AppointmentStatus | "all")}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[600px]">
              <TabsContent value={filterStatus} className="m-0 space-y-4">
                {filteredAppointments && filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <AdminAppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-sm font-medium text-gray-900">
                      Nenhum agendamento {filterStatus !== "all" ? `com status "${filterStatus}"` : ""} encontrado
                    </h3>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
