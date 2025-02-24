
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { SiteAnalytics } from "@/types/analytics";

// Interface para tipagem dos metadados de visita
interface PageVisitMetadata {
  path: string;
  hour: number;
}

// Função de guarda de tipo para validação dos metadados
function validateMetadata(value: unknown): PageVisitMetadata {
  if (
    typeof value === 'object' &&
    value !== null &&
    'path' in value &&
    'hour' in value &&
    typeof (value as any).path === 'string' &&
    typeof (value as any).hour === 'number'
  ) {
    return value as PageVisitMetadata;
  }
  return { path: '', hour: 0 };
}

export const useAnalytics = (dateRange?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<SiteAnalytics | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);

    try {
      // Buscar dados em paralelo
      const [pageVisitsResult, servicesResult, feedbacksResult, npsResult] = await Promise.all([
        supabase.from('analytics_metrics')
          .select('*')
          .eq('metric_type', 'page_visit'),
        supabase.from('services')
          .select('id, name, appointments!inner(id)')
          .eq('appointments.status', 'completed'),
        supabase.from('feedbacks').select('*'),
        supabase.from('nps_responses').select('*')
      ]);

      // Verificar erros nas requisições
      if (pageVisitsResult.error || servicesResult.error || feedbacksResult.error || npsResult.error) {
        throw new Error('Erro ao carregar dados analíticos');
      }

      // Construir objeto de analytics
      const analytics: SiteAnalytics = {
        pageVisits: pageVisitsResult.data?.map(visit => {
          const validMetadata = validateMetadata(visit.metadata);
          
          return {
            id: visit.id,
            page_path: validMetadata.path,
            count: visit.value,
            visit_date: visit.date,
            visit_hour: validMetadata.hour,
            created_at: visit.created_at,
            updated_at: visit.updated_at
          };
        }) || [],
        popularServices: servicesResult.data.map(service => ({
          service_id: service.id,
          services: { name: service.name },
          count: service.appointments?.length || 0
        })),
        feedbacks: feedbacksResult.data || [],
        npsData: npsResult.data || []
      };

      setData(analytics);
    } catch (err: any) {
      setError(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar dados quando dateRange mudar
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  return {
    ...data,
    isLoading,
    error,
    isError,
    fetchAnalytics,
  };
};
