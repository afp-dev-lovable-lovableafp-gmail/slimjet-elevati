
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AppointmentStatus } from "@/types/appointment";

interface AppointmentActionsProps {
  id: string;
  status: AppointmentStatus;
  onStatusChange: (id: string, newStatus: "confirmed" | "cancelled" | "completed") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AppointmentActions = ({
  id,
  status,
  onStatusChange,
  onDelete,
}: AppointmentActionsProps) => {
  return (
    <div className="flex space-x-2">
      {status === "pending" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(id, "confirmed")}
          >
            Confirmar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(id, "cancelled")}
            className="text-red-600 hover:text-red-700"
          >
            Cancelar
          </Button>
        </>
      )}
      {status === "confirmed" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStatusChange(id, "completed")}
        >
          Concluir
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => onDelete(id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
