
export type MetricTrend = "up" | "down" | "neutral";

export interface AnalyticsMetric {
  id: string;
  custom_metric_id: string;
  value: number;
  change_percentage: number | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DbCustomMetric {
  id: string;
  name: string;
  description: string | null;
  metric_type: string;
  calculation_method: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  analytics_metrics: AnalyticsMetric[];
}

export interface CustomMetric {
  id: string;
  name: string;
  description: string | null;
  category: string;
  display_order: number;
  value: number | null;
  trend: MetricTrend;
  change_percentage: number | null;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
}

export interface PageVisit {
  id: string;
  page_path: string;
  count: number;
  visit_date: string;
  visit_hour?: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface PopularService {
  service_id: string;
  services: {
    name: string;
  };
  count: number;
}

export interface FeedbackData {
  id: string;
  rating: number;
  comment?: string | null;
  sentiment?: string | null;
  created_at: string;
  updated_at?: string | null;
  appointment_id?: string | null;
  user_id?: string | null;
}

export interface NpsData {
  id: string;
  score: number;
  category?: string | null;
  feedback?: string | null;
  created_at: string;
  updated_at?: string | null;
  user_id?: string | null;
}

export interface SiteAnalytics {
  pageVisits: PageVisit[];
  popularServices: PopularService[];
  feedbacks: FeedbackData[];
  npsData: NpsData[];
}

export interface AnalyticsMetrics {
  totalPageViews: number;
  totalServices: number;
  averageRating: number;
  npsScore: number;
}

export interface AnalyticsResponse extends SiteAnalytics {
  metrics?: AnalyticsMetrics;
}

export interface CreateMetricDTO {
  name: string;
  description?: string | null;
  metric_type: string;
  calculation_method?: string | null;
}

export interface UpdateMetricDTO extends Partial<CreateMetricDTO> {
  id: string;
  is_active?: boolean;
}
