
import type { 
  PageVisit, 
  PopularService, 
  FeedbackData, 
  NpsData 
} from "@/types/analytics";

/**
 * Type guard para validar dados de visita de página
 */
export const isPageVisit = (value: unknown): value is PageVisit => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'page_path' in value &&
    'count' in value &&
    'visit_date' in value &&
    'visit_hour' in value
  );
};

/**
 * Type guard para validar dados de serviços populares
 */
export const isPopularService = (value: unknown): value is PopularService => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'service_id' in value &&
    'services' in value &&
    'count' in value &&
    typeof value.services === 'object' &&
    value.services !== null &&
    'name' in value.services
  );
};

/**
 * Type guard para validar dados de feedback
 */
export const isFeedbackData = (value: unknown): value is FeedbackData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'rating' in value &&
    'created_at' in value
  );
};

/**
 * Type guard para validar dados de NPS
 */
export const isNpsData = (value: unknown): value is NpsData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'score' in value &&
    'created_at' in value
  );
};
