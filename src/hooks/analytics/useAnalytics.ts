
import { useAnalyticsQuery } from "./useAnalyticsQuery";

export const useAnalytics = (dateRange: string = 'month') => {
  const query = useAnalyticsQuery(dateRange);

  return {
    ...query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
