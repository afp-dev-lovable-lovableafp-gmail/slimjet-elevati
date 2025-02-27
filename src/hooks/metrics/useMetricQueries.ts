
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mapToCustomMetric } from "@/utils/metrics/metricMappers";
import type { DbCustomMetric } from "@/types/analytics";

interface RawAnalyticsMetric {
  id: string;
  value: number;
  change_percentage: number | null;
  date: string;
  created_at: string;
  updated_at: string;
}

interface RawDbCustomMetric {
  id: string;
  name: string;
  description: string | null;
  metric_type: string;
  calculation_method: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  analytics_metrics: RawAnalyticsMetric[];
}

export const useMetricQueries = () => {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_metrics')
        .select(`
          *,
          analytics_metrics (
            id,
            value,
            change_percentage,
            date,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }
      
      // Converter os dados brutos para o formato esperado
      const processedData: DbCustomMetric[] = (data as RawDbCustomMetric[]).map(metric => ({
        ...metric,
        analytics_metrics: metric.analytics_metrics.map(am => ({
          ...am,
          custom_metric_id: metric.id
        }))
      }));
      
      return processedData.map(mapToCustomMetric);
    }
  });
};
