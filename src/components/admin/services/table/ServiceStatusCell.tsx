
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/types/service";

interface ServiceStatusCellProps {
  service: Service;
}

export const ServiceStatusCell = ({ service }: ServiceStatusCellProps) => {
  return (
    <td>
      <Badge variant={service.is_active ? "default" : "secondary"}>
        {service.is_active ? "Ativo" : "Inativo"}
      </Badge>
    </td>
  );
};
