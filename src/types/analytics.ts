
export type MetricTrend = "up" | "down" | "neutral";

// Interface que reflete a estrutura exata da tabela custom_metrics no Supabase
export interface DbCustomMetric {
  id: string;
  name: string;
  description: string | null;
  calculation_method: string | null;
  metric_type: string;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

// Interface para uso na aplicação
export interface CustomMetric {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  display_order: number;
  value: number | null;
  trend: MetricTrend | null;
  change_percentage: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsMetric {
  id: string;
  metric_id: string;
  value: number;
  trend: MetricTrend;
  change_percentage: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface PageVisit {
  id: string;
  page_path: string;
  count: number;
  visit_date: string;
  visit_hour: number;
  created_at: string;
  updated_at: string | null;
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
  comment: string | null;
  sentiment: string | null;
  created_at: string;
  updated_at: string | null;
  appointment_id: string | null;
  user_id: string | null;
}

export interface NpsData {
  id: string;
  score: number;
  category: string | null;
  feedback: string | null;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
}

export interface SiteAnalytics {
  pageVisits: PageVisit[];
  popularServices: PopularService[];
  feedbacks: FeedbackData[];
  npsData: NpsData[];
}
