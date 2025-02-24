
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "@/types/service";
import type { Tag } from "@/types/tag";

interface ServiceWithTags extends Service {
  service_tags?: {
    tag: Tag;
  }[];
}

interface ServiceListItemProps {
  service: ServiceWithTags;
  onEdit: (service: ServiceWithTags) => void;
  onDelete: (service: ServiceWithTags) => void;
}

export const ServiceListItem = ({ service, onEdit, onDelete }: ServiceListItemProps) => {
  return (
    <tr>
      <td className="font-medium">{service.name}</td>
      <td>{service.description}</td>
      <td>
        <div className="flex flex-wrap gap-1">
          {service.service_tags?.map((st) => (
            <Badge key={st.tag.id} variant="secondary">
              {st.tag.name}
            </Badge>
          ))}
        </div>
      </td>
      <td>{service.display_order}</td>
      <td>
        <Badge variant={service.is_active ? "default" : "secondary"}>
          {service.is_active ? "Ativo" : "Inativo"}
        </Badge>
      </td>
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
    </tr>
  );
};
