
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsData } from "./analyticsService";
import { validateAnalyticsData } from "./useAnalyticsValidation";
import type { AnalyticsResponse } from "@/types/analytics";

/**
 * Hook para buscar dados analíticos com validação e cache
 * @param dateRange - Período de tempo para os dados ('week' | 'month' | 'year')
 * @returns Query object com dados analíticos, estado de loading e erro
 */
export const useAnalyticsQuery = (dateRange: string = 'month') => {
  return useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const data = await fetchAnalyticsData(dateRange);
      if (!validateAnalyticsData(data)) {
        throw new Error('Invalid analytics data structure');
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
