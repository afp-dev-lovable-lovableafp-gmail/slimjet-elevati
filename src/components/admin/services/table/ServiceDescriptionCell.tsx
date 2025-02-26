
import type { Service } from "@/types/service";

interface ServiceDescriptionCellProps {
  service: Service;
}

export const ServiceDescriptionCell = ({ service }: ServiceDescriptionCellProps) => {
  return <td>{service.description}</td>;
};
