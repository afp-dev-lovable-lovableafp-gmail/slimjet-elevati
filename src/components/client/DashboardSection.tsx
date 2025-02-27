import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppointmentQueries } from '@/hooks/appointments/useAppointmentQueries';
import { WelcomeHeader, BookingCTA, DashboardStats, AppointmentsTabs } from './dashboard';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const DashboardSection = () => {
  const { user, client, loading: authLoading } = useAuth();
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
          <Link to="/auth">Fazer login</Link>
        </Button>
      </div>
    );
  }

  const isLoading = authLoading || loadingAppointments;

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando...</span>
          </div>
        </Card>
      </div>
    );
  }

  const pendingAppointments = appointments?.filter(a => a.status === 'pending') || [];
  const completedAppointments = appointments?.filter(a => a.status === 'completed') || [];
  const cancelledAppointments = appointments?.filter(a => a.status === 'cancelled') || [];

  return (
    <div className="container py-8">
      <WelcomeHeader 
        name={client?.full_name} 
        avatarUrl={client?.avatar_url} 
      />

      <DashboardStats 
        pendingAppointments={pendingAppointments}
        completedAppointments={completedAppointments}
      />

      <BookingCTA />

      <AppointmentsTabs 
        appointments={appointments || []}
        pendingAppointments={pendingAppointments}
        completedAppointments={completedAppointments}
        cancelledAppointments={cancelledAppointments}
      />
    </div>
  );
}; 