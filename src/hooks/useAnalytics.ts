
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { AnalyticsMetrics, PageVisit, PopularService, FeedbackData, NpsData } from "@/types/analytics";

const calculateMetrics = (
  pageVisits: PageVisit[],
  servicesCount: number,
  feedbacks: FeedbackData[],
  npsData: NpsData[]
): AnalyticsMetrics => {
  const totalPageViews = pageVisits.reduce((sum, visit) => sum + visit.count, 0);
  
  const averageRating = feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;
  
  const npsScore = npsData.length > 0
    ? npsData.reduce((sum, n) => sum + n.score, 0) / npsData.length
    : 0;

  return {
    totalPageViews,
    totalServices: servicesCount,
    averageRating,
    npsScore
  };
};

export const useAnalytics = (dateRange: string = 'month') => {
  const query = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      try {
        // Buscar visitas de página
        const { data: pageVisits } = await supabase
          .from('page_visits')
          .select('*');

        // Buscar serviços populares com join na tabela services
        const { data: popularServicesRaw } = await supabase
          .from('popular_services')
          .select(`
            *,
            services:service_id (
              name
            )
          `);

        // Mapear os serviços populares para o formato correto
        const popularServices: PopularService[] = (popularServicesRaw || []).map(service => ({
          service_id: service.service_id,
          services: {
            name: service.services?.name || service.name || ''
          },
          count: service.count || 0
        }));

        // Buscar feedbacks
        const { data: feedbacks } = await supabase
          .from('feedbacks')
          .select('*');

        // Buscar dados NPS
        const { data: npsData } = await supabase
          .from('nps_responses')
          .select('*');

        const metrics = calculateMetrics(
          pageVisits || [],
          popularServices.length,
          feedbacks || [],
          npsData || []
        );

        return {
          metrics,
          pageVisits: pageVisits || [],
          popularServices,
          feedbacks: feedbacks || [],
          npsData: npsData || [],
          isLoading: false,
          isError: false
        };
      } catch (error) {
        console.error('Erro ao carregar dados analíticos:', error);
        return {
          metrics: {
            totalPageViews: 0,
            totalServices: 0,
            averageRating: 0,
            npsScore: 0
          },
          pageVisits: [],
          popularServices: [],
          feedbacks: [],
          npsData: [],
          isLoading: false,
          isError: true
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2
  });

  return {
    ...query.data,
    isLoading: query.isLoading,
    isError: query.isError
  };
};
