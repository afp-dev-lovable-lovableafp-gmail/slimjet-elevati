
import { useMemo } from "react";
import type { AppointmentStatus } from "@/types/appointment";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const statusTranslations = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Concluído",
} as const;

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
} as const;

export const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  const currentStatus = status || "pending";

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[currentStatus]}`}>
      {statusTranslations[currentStatus]}
    </span>
  );
};
