
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DbCustomMetric } from "@/types/analytics";

export const useCustomMetricsState = () => {
  const queryClient = useQueryClient();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['custom-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_metrics')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom metrics:', error);
        throw error;
      }

      return data as DbCustomMetric[];
    }
  });

  const prefetchMetric = async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['custom-metrics', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('custom_metrics')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      }
    });
  };

  return {
    metrics,
    isLoading,
    error,
    prefetchMetric
  };
};
