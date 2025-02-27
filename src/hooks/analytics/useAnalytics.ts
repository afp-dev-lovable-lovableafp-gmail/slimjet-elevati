
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { AnalyticsMetrics, PageVisit, PopularService, FeedbackData, NpsData } from "@/types/analytics";
import { logger } from "@/features/logging/logger";
import { toAppError } from "@/types/extended-error";

const formatError = (error: PostgrestError) => ({
  message: error.message,
  details: error.details,
  hint: error.hint,
  code: error.code
});

const calculateMetrics = (
  pageVisits: PageVisit[],
  servicesCount: number,
  feedbacks: FeedbackData[],
  npsData: NpsData[]
): AnalyticsMetrics => {
  const totalPageViews = pageVisits.reduce((sum, visit) => sum + (visit.count || 0), 0);
  
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
        logger.info('analytics', 'Iniciando busca de dados analíticos');
        
        // Buscar visitas de página
        const { data: pageVisits, error: pageVisitsError } = await supabase
          .from('page_visits')
          .select('*');

        if (pageVisitsError) {
          const appError = toAppError(pageVisitsError, {
            dateRange
          });
          
          logger.error('analytics', 'Erro ao buscar visitas de página', appError);
          throw pageVisitsError;
        }

        // Buscar serviços populares com join na tabela services
        const { data: popularServicesRaw, error: servicesError } = await supabase
          .from('popular_services')
          .select(`
            *,
            services:service_id (
              name
            )
          `);

        if (servicesError) {
          const appError = toAppError(servicesError, {
            dateRange
          });
          
          logger.error('analytics', 'Erro ao buscar serviços populares', appError);
          throw servicesError;
        }

        // Mapear os serviços populares para o formato correto
        const popularServices: PopularService[] = (popularServicesRaw || []).map(service => ({
          service_id: service.service_id,
          services: {
            name: service.services?.name || service.name || ''
          },
          count: service.count || 0
        }));

        // Buscar feedbacks
        const { data: feedbacks, error: feedbacksError } = await supabase
          .from('feedbacks')
          .select('*');

        if (feedbacksError) {
          const appError = toAppError(feedbacksError, {
            dateRange
          });
          
          logger.error('analytics', 'Erro ao buscar feedbacks', appError);
          throw feedbacksError;
        }

        // Buscar dados NPS
        const { data: npsData, error: npsError } = await supabase
          .from('nps_responses')
          .select('*');

        if (npsError) {
          const appError = toAppError(npsError, {
            dateRange
          });
          
          logger.error('analytics', 'Erro ao buscar dados NPS', appError);
          throw npsError;
        }

        const metrics = calculateMetrics(
          pageVisits || [],
          popularServices.length,
          feedbacks || [],
          npsData || []
        );

        logger.info('analytics', 'Dados analíticos carregados com sucesso');

        return {
          metrics,
          pageVisits: pageVisits || [],
          popularServices,
          feedbacks: feedbacks || [],
          npsData: npsData || [],
          isLoading: false,
          isError: false
        };
      } catch (err) {
        const error = err as Error;
        const appError = toAppError(error, {
          dateRange
        });
        
        logger.error("analytics", "Erro ao carregar dados analíticos", appError);
        
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
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    ...query.data,
    isLoading: query.isLoading,
    isError: query.isError
  };
};
