
import type { CustomMetric, DbCustomMetric, MetricTrend } from "@/types/analytics";

export const mapToDbMetric = (metric: Partial<CustomMetric>): Omit<DbCustomMetric, 'id' | 'created_at' | 'updated_at'> & {
  metric_type: string;
  name: string;
} => {
  return {
    name: metric.name || '',
    description: metric.description || null,
    calculation_method: null,
    metric_type: metric.category || 'default',
    is_active: true
  };
};

export const mapToCustomMetric = (dbMetric: DbCustomMetric): CustomMetric => {
  return {
    id: dbMetric.id,
    name: dbMetric.name,
    description: dbMetric.description,
    category: dbMetric.metric_type,
    display_order: 0,
    value: null,
    trend: null,
    change_percentage: null,
    created_at: dbMetric.created_at,
    updated_at: dbMetric.updated_at
  };
};

export const getTrend = (value: number | null): MetricTrend => {
  if (!value) return "neutral";
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};
