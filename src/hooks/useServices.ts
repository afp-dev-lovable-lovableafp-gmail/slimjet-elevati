
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";
import type { Tag } from "@/types/tag";

interface ServiceWithTags extends Service {
  service_tags: {
    tag: Tag;
  }[];
}

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          service_tags (
            tag: tags (*)
          )
        `)
        .eq('is_active', true) // Filtrar apenas serviços ativos
        .order("display_order");

      if (error) throw error;
      
      return (data || []) as ServiceWithTags[];
    },
  });
};
