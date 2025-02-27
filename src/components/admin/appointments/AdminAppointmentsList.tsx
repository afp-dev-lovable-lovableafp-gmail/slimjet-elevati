import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CalendarIcon, Clock, User, Building, Phone, Mail, FileText } from "lucide-react";
import { formatDate, formatTime } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

interface AdminAppointmentsListProps {
  appointments: Appointment[];
  isLoading?: boolean;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

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

const AdminAppointmentsList = ({ appointments, isLoading = false, onUpdateStatus }: AdminAppointmentsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum agendamento</h3>
        <p className="mt-1 text-sm text-gray-500">Não há agendamentos para exibir no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{appointment.services?.name || 'Serviço'}</h3>
                <div className="flex items-center space-x-2 text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(appointment.scheduled_at)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{formatTime(appointment.scheduled_at)}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(appointment.status)} mt-2 md:mt-0`}>
                {getStatusText(appointment.status)}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span>{appointment.profiles?.full_name || 'Cliente'}</span>
              </div>
              {appointment.profiles?.company_name && (
                <div className="flex items-center text-gray-700">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{appointment.profiles.company_name}</span>
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

            <div className="flex flex-wrap gap-2">
              {appointment.status === 'pending' && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">
                        <Check className="h-4 w-4 mr-2" />
                        Confirmar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja confirmar este agendamento?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUpdateStatus(appointment.id, 'confirmed')}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onUpdateStatus(appointment.id, 'cancelled')}>
                          Cancelar Agendamento
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {appointment.status === 'confirmed' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default">
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como Concluído
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Concluir Agendamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Confirma que este agendamento foi concluído?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onUpdateStatus(appointment.id, 'completed')}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminAppointmentsList; 