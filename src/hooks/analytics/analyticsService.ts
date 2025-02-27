
import { supabase } from "@/lib/supabase";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import { 
  isPageVisit, 
  isPopularService, 
  isFeedbackData, 
  isNpsData 
} from "./typeGuards";
import { logger } from "@/features/logging/logger";
import { toAppError } from "@/types/extended-error";
import type { 
  PageVisit, 
  PopularService, 
  FeedbackData, 
  NpsData,
  SiteAnalytics,
  AnalyticsResponse 
} from "@/types/analytics";

const MODULE = 'analytics-service';

/**
 * Calcula o intervalo de datas com base no período selecionado
 * @param dateRange - Período desejado ('week' | 'month' | 'year')
 * @returns Objeto com data inicial e final
 */
const calculateDateRange = (dateRange: string) => {
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

/**
 * Calcula métricas agregadas com base nos dados analíticos
 * @param data - Dados analíticos brutos
 * @returns Objeto com métricas calculadas
 */
const calculateMetrics = (data: SiteAnalytics) => {
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

/**
 * Busca dados de visitas de página com validação de tipo
 */
const fetchPageVisits = async (startDate: Date, endDate: Date): Promise<PageVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('page_visits')
      .select('*')
      .gte('visit_date', format(startDate, 'yyyy-MM-dd'))
      .lte('visit_date', format(endDate, 'yyyy-MM-dd'))
      .order('count', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (err) {
    const appError = toAppError(err, {
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
    
    logger.error(MODULE, 'Failed to fetch page visits', appError);
    throw new Error('Falha ao carregar dados de visitas');
  }
};

/**
 * Busca dados de serviços populares com validação de tipo
 */
const fetchPopularServices = async (): Promise<PopularService[]> => {
  try {
    const { data, error } = await supabase
      .from('popular_services')
      .select(`
        service_id,
        name,
        count,
        services:services(name)
      `)
      .limit(5);

    if (error) throw error;
    
    return (data || []).map(item => ({
      service_id: item.service_id,
      services: {
        name: item.services?.[0]?.name || item.name || ''
      },
      count: item.count || 0
    })).filter(isPopularService);
  } catch (err) {
    const appError = toAppError(err);
    logger.error(MODULE, 'Failed to fetch popular services', appError);
    throw new Error('Falha ao carregar dados de serviços populares');
  }
};

/**
 * Busca dados de feedback com validação de tipo
 */
const fetchFeedbacks = async (startDate: Date, endDate: Date): Promise<FeedbackData[]> => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).filter(isFeedbackData);
  } catch (err) {
    const appError = toAppError(err, {
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
    
    logger.error(MODULE, 'Failed to fetch feedbacks', appError);
    throw new Error('Falha ao carregar dados de feedback');
  }
};

/**
 * Busca dados de NPS com validação de tipo
 */
const fetchNpsData = async (startDate: Date, endDate: Date): Promise<NpsData[]> => {
  try {
    const { data, error } = await supabase
      .from('nps_responses')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    return (data || []).filter(isNpsData);
  } catch (err) {
    const appError = toAppError(err, {
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });
    
    logger.error(MODULE, 'Failed to fetch NPS data', appError);
    throw new Error('Falha ao carregar dados NPS');
  }
};

/**
 * Busca e agrega todos os dados analíticos necessários
 * @param dateRange - Período desejado ('week' | 'month' | 'year')
 * @returns Dados analíticos consolidados e validados
 */
export const fetchAnalyticsData = async (dateRange: string): Promise<AnalyticsResponse> => {
  const { start, end } = calculateDateRange(dateRange);

  try {
    const [pageVisits, popularServices, feedbacks, npsData] = await Promise.all([
      fetchPageVisits(start, end),
      fetchPopularServices(),
      fetchFeedbacks(start, end),
      fetchNpsData(start, end)
    ]);

    const analyticsData: SiteAnalytics = {
      pageVisits,
      popularServices,
      feedbacks,
      npsData
    };

    logger.info(MODULE, 'Analytics data fetched successfully', {
      dateRange,
      metricsCount: {
        pageVisits: pageVisits.length,
        popularServices: popularServices.length,
        feedbacks: feedbacks.length,
        npsData: npsData.length
      }
    });

    return {
      ...analyticsData,
      metrics: calculateMetrics(analyticsData)
    };
  } catch (err) {
    const appError = toAppError(err, { dateRange });
    logger.error(MODULE, 'Failed to fetch analytics data', appError);
    throw err;
  }
};
