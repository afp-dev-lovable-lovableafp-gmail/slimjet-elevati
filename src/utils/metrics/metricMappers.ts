
import type { CustomMetric, DbCustomMetric, MetricTrend, AnalyticsMetric } from "@/types/analytics";

export const mapToCustomMetric = (dbMetric: DbCustomMetric): CustomMetric => {
  const latestMetric = dbMetric.analytics_metrics?.[0];
  
  return {
    id: dbMetric.id,
    name: dbMetric.name,
    description: dbMetric.description,
    category: dbMetric.metric_type,
    display_order: 0,
    value: latestMetric?.value ?? null,
    trend: getTrend(latestMetric?.change_percentage ?? null),
    change_percentage: latestMetric?.change_percentage ?? null,
    created_at: dbMetric.created_at,
    updated_at: dbMetric.updated_at,
    is_active: dbMetric.is_active
  };
};

export const getTrend = (changePercentage: number | null): MetricTrend => {
  if (!changePercentage) return "neutral";
  if (changePercentage > 0) return "up";
  if (changePercentage < 0) return "down";
  return "neutral";
};
