
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '@/utils/date';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

const AppointmentsList = ({ appointments, isLoading = false }: AppointmentsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">Carregando agendamentos...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum agendamento</h3>
        <p className="mt-1 text-sm text-gray-500">Você ainda não tem agendamentos registrados.</p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/schedule">Fazer um agendamento</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {appointments.map((appointment) => (
        <Link 
          key={appointment.id} 
          to={`/appointment/${appointment.id}`}
          className="block"
        >
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{appointment.services?.name || 'Serviço'}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{formatDate(appointment.scheduled_at)}</span>
                  <span>•</span>
                  <span>{formatTime(appointment.scheduled_at)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </Badge>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AppointmentsList;
