
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DbCustomMetric } from "@/types/analytics";

export const useCustomMetricsQuery = () => {
  return useQuery({
    queryKey: ['custom-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_metrics')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as DbCustomMetric[];
    },
  });
};
