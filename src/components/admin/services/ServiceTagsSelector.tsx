
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Tag } from "@/types/tag";

interface ServiceTagsSelectorProps {
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
}

export const ServiceTagsSelector = ({
  selectedTags,
  onTagToggle
}: ServiceTagsSelectorProps) => {
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data as Tag[];
    },
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <Button
            key={tag.id}
            type="button"
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            onClick={() => onTagToggle(tag.id)}
            className={cn(
              "text-sm",
              selectedTags.includes(tag.id) && "bg-primary text-primary-foreground"
            )}
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
