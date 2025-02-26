
import type { Service } from "@/types/service";

interface ServiceNameCellProps {
  service: Service;
}

export const ServiceNameCell = ({ service }: ServiceNameCellProps) => {
  return <td className="font-medium">{service.name}</td>;
};
