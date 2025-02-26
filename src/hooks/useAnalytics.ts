import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import type { 
  PageVisit, 
  PopularService, 
  CustomMetric, 
  FeedbackData, 
  NpsData,
  SiteAnalytics
} from "@/types/analytics";

interface AnalyticsMetrics {
  totalPageViews: number;
  totalServices: number;
  averageRating: number;
  npsScore: number;
}

interface AnalyticsResponse extends SiteAnalytics {
  metrics: AnalyticsMetrics;
}

// Type guard para PageVisit
function isPageVisit(value: unknown): value is PageVisit {
  return (
    typeof value === 'object' &&
    value !== null &&
    'page_path' in value &&
    'count' in value
  );
}

// Type guard para NpsData
function isNpsData(value: unknown): value is NpsData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'score' in value
  );
}

const calculateMetrics = (data: SiteAnalytics): AnalyticsMetrics => {
  return {
    totalPageViews: data.pageVisits.reduce((sum, visit) => sum + visit.count, 0),
    totalServices: data.popularServices.length,
    averageRating: data.feedbacks.length > 0 
      ? data.feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / data.feedbacks.length 
      : 0,
    npsScore: data.npsData.length > 0
      ? data.npsData.reduce((sum, n) => sum + (n.score || 0), 0) / data.npsData.length
      : 0
  };
};

const fetchPageVisits = async (startDate: Date, endDate: Date): Promise<PageVisit[]> => {
  const { data, error } = await supabase
    .from('page_visits')  // Mudamos para a tabela correta
    .select('*')
    .gte('visit_date', format(startDate, 'yyyy-MM-dd'))
    .lte('visit_date', format(endDate, 'yyyy-MM-dd'))
    .order('count', { ascending: false });

  if (error) {
    console.error('Erro ao buscar visitas:', error);
    throw new Error('Falha ao carregar dados de visitas');
  }

  return data || [];
};

const fetchPopularServices = async (): Promise<PopularService[]> => {
  const { data, error } = await supabase
    .from('popular_services')
    .select(`
      service_id,
      name,
      count,
      services:services(name)
    `)
    .limit(5);

  if (error) {
    console.error('Erro ao buscar serviços populares:', error);
    throw new Error('Falha ao carregar dados de serviços');
  }

  return (data || []).map(item => ({
    service_id: item.service_id,
    services: {
      name: item.services?.[0]?.name || item.name || ''
    },
    count: item.count || 0
  }));
};

const fetchFeedbacks = async (startDate: Date, endDate: Date): Promise<FeedbackData[]> => {
  const { data, error } = await supabase
    .from('feedbacks')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar feedbacks:', error);
    throw new Error('Falha ao carregar dados de feedback');
  }

  return data || [];
};

const fetchNpsData = async (startDate: Date, endDate: Date): Promise<NpsData[]> => {
  const { data, error } = await supabase
    .from('nps_responses')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar dados NPS:', error);
    throw new Error('Falha ao carregar dados NPS');
  }

  return (data || []).filter(isNpsData);
};

export const useAnalytics = (dateRange: string = 'month') => {
  const calculateDateRange = () => {
    const today = new Date();
    switch (dateRange) {
      case 'week':
        return { start: addDays(today, -7), end: today };
      case 'year':
        return { 
          start: new Date(today.getFullYear(), 0, 1),
          end: new Date(today.getFullYear(), 11, 31)
        };
      default: // month
        return { 
          start: startOfMonth(today),
          end: endOfMonth(today)
        };
    }
  };

  const { start: startDate, end: endDate } = calculateDateRange();

  const query = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async (): Promise<AnalyticsResponse> => {
      try {
        const [pageVisits, popularServices, feedbacks, npsData] = await Promise.all([
          fetchPageVisits(startDate, endDate),
          fetchPopularServices(),
          fetchFeedbacks(startDate, endDate),
          fetchNpsData(startDate, endDate)
        ]);

        const analyticsData: SiteAnalytics = {
          pageVisits,
          popularServices,
          feedbacks,
          npsData
        };

        return {
          ...analyticsData,
          metrics: calculateMetrics(analyticsData)
        };
      } catch (error) {
        console.error('Erro ao carregar dados analíticos:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos de cache
    retry: 2
  });

  return {
    ...query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
};
