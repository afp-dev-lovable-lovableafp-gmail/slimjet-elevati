
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckCircle, Clock } from "lucide-react";
import type { Appointment } from '@/types/appointment';

interface DashboardStatsProps {
  pendingAppointments: Appointment[];
  completedAppointments: Appointment[];
}

const DashboardStats = ({ pendingAppointments, completedAppointments }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 mt-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agendamentos Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingAppointments.length}</div>
          <p className="text-xs text-muted-foreground">
            Agendamentos aguardando confirmação
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {pendingAppointments.length > 0 ? (
            <>
              <div className="text-2xl font-bold">
                {new Date(pendingAppointments[0].scheduled_at).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(pendingAppointments[0].scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                - {pendingAppointments[0].services?.name || 'Consulta'}
              </p>
            </>
          ) : (
            <>
              <div className="text-lg font-medium">Nenhuma consulta</div>
              <p className="text-xs text-muted-foreground">
                Agende sua primeira consulta
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consultas Realizadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAppointments.length}</div>
          <p className="text-xs text-muted-foreground">
            Consultas já realizadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
