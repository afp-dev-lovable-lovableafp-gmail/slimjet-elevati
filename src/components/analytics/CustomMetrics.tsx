
import { useState } from "react";
import { useCustomMetrics } from "@/hooks/analytics/useCustomMetrics";
import { Card } from "@/components/ui/card";
import MetricsCard from "./MetricsCard";
import { CustomMetricsGrid } from "./metrics/CustomMetricsGrid";
import CustomMetricsHeader from "./metrics/CustomMetricsHeader";
import { Skeleton } from "@/components/ui/skeleton";
import type { CustomMetric, MetricTrend } from "@/types/analytics";

export const CustomMetrics = () => {
  const { metrics, isLoading, error } = useCustomMetrics();
  const [selectedType, setSelectedType] = useState<string>("all");

  const getTrend = (value: number | null): MetricTrend => {
    if (!value) return "neutral";
    if (value > 0) return "up";
    if (value < 0) return "down";
    return "neutral";
  };

  const metricTypes = Array.from(new Set(metrics.map(m => m.category || "Outros")));

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          Erro ao carregar métricas: {error.message}
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!metrics.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Nenhuma métrica personalizada encontrada.
        </div>
      </Card>
    );
  }

  const filteredMetrics = selectedType === "all" 
    ? metrics 
    : metrics.filter(m => m.category === selectedType);

  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    const category = metric.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {} as Record<string, CustomMetric[]>);

  return (
    <div className="space-y-6">
      <CustomMetricsHeader 
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        metricTypes={["all", ...metricTypes]}
      />
      
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <CustomMetricsGrid>
            {categoryMetrics.map((metric) => (
              <MetricsCard
                key={metric.id}
                title={metric.name}
                value={metric.value ?? "N/A"}
                description={metric.description || ""}
                trend={getTrend(metric.change_percentage)}
              />
            ))}
          </CustomMetricsGrid>
        </div>
      ))}
    </div>
  );
};

export default CustomMetrics;
