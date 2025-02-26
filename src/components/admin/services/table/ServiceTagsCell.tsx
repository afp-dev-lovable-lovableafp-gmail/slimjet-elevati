
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/types/service";
import type { Tag } from "@/types/tag";

interface ServiceWithTags extends Service {
  service_tags?: {
    tag: Tag;
  }[];
}

interface ServiceTagsCellProps {
  service: ServiceWithTags;
}

export const ServiceTagsCell = ({ service }: ServiceTagsCellProps) => {
  return (
    <td>
      <div className="flex flex-wrap gap-1">
        {service.service_tags?.map((st) => (
          <Badge key={st.tag.id} variant="secondary">
            {st.tag.name}
          </Badge>
        ))}
      </div>
    </td>
  );
};
