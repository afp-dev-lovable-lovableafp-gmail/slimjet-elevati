
export interface CustomMetric {
  id: string;
  name: string;
  description?: string;
  metric_type: string;
  calculation_method?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CreateCustomMetricDTO = Omit<CustomMetric, 'id' | 'created_at' | 'updated_at'>;
