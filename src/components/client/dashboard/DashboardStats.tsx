import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, CheckCircleIcon, CalendarIcon } from 'lucide-react';
import { formatDate } from '@/utils/date';
import type { Appointment } from '@/types/appointment';

interface DashboardStatsProps {
  pendingAppointments: Appointment[];
  completedAppointments: Appointment[];
}

const DashboardStats = ({ pendingAppointments, completedAppointments }: DashboardStatsProps) => {
  return (
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
  );
};

export default DashboardStats; 