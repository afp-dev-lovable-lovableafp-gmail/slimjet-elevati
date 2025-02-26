
import type { 
  PageVisit, 
  PopularService, 
  FeedbackData, 
  NpsData,
  AnalyticsResponse 
} from "@/types/analytics";

/**
 * Valida a estrutura completa dos dados analíticos
 * @param data - Dados a serem validados
 * @returns Boolean indicando se os dados são válidos
 */
export const validateAnalyticsData = (data: AnalyticsResponse): boolean => {
  if (!data || typeof data !== 'object') return false;

  // Validate pageVisits
  if (!Array.isArray(data.pageVisits)) return false;
  if (!data.pageVisits.every(visit => (
    typeof visit.page_path === 'string' &&
    typeof visit.count === 'number' &&
    typeof visit.visit_date === 'string' &&
    typeof visit.visit_hour === 'number'
  ))) return false;

  // Validate popularServices
  if (!Array.isArray(data.popularServices)) return false;
  if (!data.popularServices.every(service => (
    typeof service.service_id === 'string' &&
    typeof service.count === 'number' &&
    service.services &&
    typeof service.services.name === 'string'
  ))) return false;

  // Validate feedbacks
  if (!Array.isArray(data.feedbacks)) return false;
  if (!data.feedbacks.every(feedback => (
    typeof feedback.id === 'string' &&
    typeof feedback.rating === 'number' &&
    typeof feedback.created_at === 'string'
  ))) return false;

  // Validate NPS data
  if (!Array.isArray(data.npsData)) return false;
  if (!data.npsData.every(nps => (
    typeof nps.id === 'string' &&
    typeof nps.score === 'number' &&
    typeof nps.created_at === 'string'
  ))) return false;

  return true;
};

export const useAnalyticsValidation = () => {
  return {
    validateAnalyticsData
  };
};
