
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CustomMetric, MetricTrend } from "@/types/analytics";

interface DatabaseMetric {
  id: string;
  name: string;
  description: string | null;
  metric_type: string;
  display_order: number | null;
  calculation_method: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metrics: Array<{
    value: number;
    change_percentage: number | null;
  }> | null;
}

const calculateTrend = (changePercentage: number | null): MetricTrend => {
  if (changePercentage === null) return "neutral";
  if (changePercentage > 0) return "up";
  if (changePercentage < 0) return "down";
  return "neutral";
};

export const useCustomMetrics = () => {
  const query = useQuery({
    queryKey: ["custom-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_metrics")
        .select(`
          id,
          name,
          description,
          metric_type,
          display_order,
          calculation_method,
          is_active,
          created_at,
          updated_at,
          metrics:analytics_metrics(value, change_percentage)
        `)
        .eq('is_active', true);

      if (error) throw error;

      const metrics = (data as unknown as DatabaseMetric[]).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.metric_type,
        display_order: item.display_order || 0,
        value: item.metrics?.[0]?.value ?? null,
        trend: calculateTrend(item.metrics?.[0]?.change_percentage),
        change_percentage: item.metrics?.[0]?.change_percentage ?? null,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      return metrics;
    }
  });

  return {
    metrics: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error
  };
};
