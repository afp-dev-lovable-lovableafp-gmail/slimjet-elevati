
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/types/appointment";

interface AppointmentItemProps {
  appointment: Appointment;
  onCancel: (id: string) => Promise<void>;
  onFeedback: (id: string) => void;
}

export const AppointmentItem = ({ 
  appointment, 
  onCancel, 
  onFeedback 
}: AppointmentItemProps) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const statusTranslations = {
    pending: "Pendente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    completed: "Concluído",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">
            {appointment.services.name}
          </h3>
          <p className="text-gray-600">
            {format(new Date(appointment.scheduled_at), "PPP 'às' HH:mm", {
              locale: ptBR,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              statusStyles[appointment.status]
            }`}
          >
            {statusTranslations[appointment.status]}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Valor: R$ {appointment.services.price.toFixed(2)}
        </p>
        <div className="flex gap-2">
          {appointment.status === "pending" && (
            <Button
              variant="destructive"
              onClick={() => onCancel(appointment.id)}
            >
              Cancelar
            </Button>
          )}
          {appointment.status === "completed" && (
            <Button
              variant="outline"
              onClick={() => onFeedback(appointment.id)}
            >
              Avaliar
            </Button>
          )}
        </div>
      </div>

      {appointment.notes && (
        <p className="text-sm text-gray-600">
          <strong>Observações:</strong> {appointment.notes}
        </p>
      )}

      {appointment.meeting_url && (
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <a href={appointment.meeting_url} target="_blank" rel="noopener noreferrer">
            Acessar Reunião
          </a>
        </Button>
      )}
    </div>
  );
};
