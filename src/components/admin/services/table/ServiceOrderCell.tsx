
import type { Service } from "@/types/service";

interface ServiceOrderCellProps {
  service: Service;
}

export const ServiceOrderCell = ({ service }: ServiceOrderCellProps) => {
  return <td>{service.display_order}</td>;
};
