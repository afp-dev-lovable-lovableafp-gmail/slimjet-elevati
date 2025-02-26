
import { useQueryClient } from "@tanstack/react-query";
import { fetchAnalyticsData } from "./analyticsService";

export const usePrefetchAnalytics = () => {
  const queryClient = useQueryClient();

  const prefetchAnalytics = async (dateRange: string = 'month') => {
    await queryClient.prefetchQuery({
      queryKey: ['analytics', dateRange],
      queryFn: () => fetchAnalyticsData(dateRange),
      staleTime: 5 * 60 * 1000
    });
  };

  const preFetchAllRanges = async () => {
    await Promise.all([
      prefetchAnalytics('week'),
      prefetchAnalytics('month'),
      prefetchAnalytics('year')
    ]);
  };

  return {
    prefetchAnalytics,
    preFetchAllRanges
  };
};
