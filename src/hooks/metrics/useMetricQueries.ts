
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapToCustomMetric, getTrend } from "@/utils/metrics/metricMappers";
import type { DbCustomMetric } from "@/types/analytics";

export const useMetricQueries = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_metrics')
        .select(`
          *,
          analytics_metrics (
            value,
            change_percentage
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      return (data as DbCustomMetric[]).map(mapToCustomMetric);
    }
  });
};
