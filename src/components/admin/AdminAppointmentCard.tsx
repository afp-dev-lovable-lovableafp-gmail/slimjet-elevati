
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CalendarIcon, Clock, User, Building, Phone, Mail, FileText, ExternalLink } from "lucide-react";
import { formatDate, formatTime } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

interface AdminAppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

const AdminAppointmentCard = ({ appointment, onUpdateStatus }: AdminAppointmentCardProps) => {
  const [meetingUrl, setMeetingUrl] = useState(appointment.meeting_url || '');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusUpdate = async (status: AppointmentStatus) => {
    try {
      setIsUpdating(true);
      await onUpdateStatus(appointment.id, status);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const clientName = appointment.profiles?.full_name || 'Cliente';
  const companyName = appointment.profiles?.company_name;
  const serviceName = appointment.services?.name || 'Serviço';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-4 md:p-5 flex-1">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{serviceName}</h3>
                <div className="flex items-center space-x-1 text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(appointment.scheduled_at)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{formatTime(appointment.scheduled_at)}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(appointment.status)} capitalize self-start md:self-center`}>
                {appointment.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span>{clientName}</span>
              </div>
              {companyName && (
                <div className="flex items-center text-gray-700">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{companyName}</span>
                </div>
              )}
              {appointment.profiles?.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{appointment.profiles.phone}</span>
                </div>
              )}
              {appointment.profiles?.email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{appointment.profiles.email}</span>
                </div>
              )}
            </div>

            {appointment.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-1" /> Observações
                </h4>
                <p className="text-gray-600 text-sm p-2 bg-gray-50 rounded-md">
                  {appointment.notes}
                </p>
              </div>
            )}

            {appointment.meeting_url && (
              <div className="mb-4">
                <h4 className="text-sm font-medium flex items-center mb-1">
                  <ExternalLink className="h-4 w-4 mr-1" /> Link da reunião
                </h4>
                <a 
                  href={appointment.meeting_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  {appointment.meeting_url} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 md:w-48 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
            {appointment.status === 'pending' && (
              <Button 
                size="sm" 
                variant="default" 
                className="w-full"
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 mr-1" /> Confirmar
              </Button>
            )}
            
            {appointment.status === 'confirmed' && (
              <Button 
                size="sm" 
                variant="default" 
                className="w-full"
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
              >
                <Check className="h-4 w-4 mr-1" /> Concluir
              </Button>
            )}
            
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="w-full"
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja cancelar este agendamento? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusUpdate('cancelled')}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAppointmentCard;
