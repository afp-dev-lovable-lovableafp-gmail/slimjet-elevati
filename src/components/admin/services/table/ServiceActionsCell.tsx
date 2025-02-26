
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/types/service";

interface ServiceActionsCellProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export const ServiceActionsCell = ({ service, onEdit, onDelete }: ServiceActionsCellProps) => {
  return (
    <td className="text-right">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(service)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(service)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </td>
  );
};
