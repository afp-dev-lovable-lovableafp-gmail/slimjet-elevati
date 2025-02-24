
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock } from "lucide-react";
import type { Appointment } from "@/types/appointment";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentActions } from "./AppointmentActions";

interface AppointmentsListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, newStatus: "confirmed" | "cancelled" | "completed") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AppointmentsList = ({
  appointments,
  onStatusChange,
  onDelete,
}: AppointmentsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Serviço</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments?.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              {appointment.profiles?.full_name}
              {appointment.profiles?.company_name && (
                <div className="text-sm text-muted-foreground">
                  {appointment.profiles.company_name}
                </div>
              )}
            </TableCell>
            <TableCell>{appointment.services?.name}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(appointment.scheduled_at), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {format(new Date(appointment.scheduled_at), "HH:mm", {
                  locale: ptBR,
                })}
              </div>
            </TableCell>
            <TableCell>
              <AppointmentStatusBadge status={appointment.status} />
            </TableCell>
            <TableCell>
              <AppointmentActions
                id={appointment.id}
                status={appointment.status}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
        {appointments?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              Nenhum agendamento encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
