
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { MetricTrend, AnalyticsMetrics } from "@/types/analytics";

interface MetricsOverviewProps {
  metrics: AnalyticsMetrics;
  getTrend: (value: number) => MetricTrend;
}

export const MetricsOverview = ({ metrics, getTrend }: MetricsOverviewProps) => {
  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricItems = [
    {
      name: "Visualizações de página",
      value: metrics.totalPageViews,
      category: "Tráfego"
    },
    {
      name: "Serviços oferecidos",
      value: metrics.totalServices,
      category: "Serviços"
    },
    {
      name: "Avaliação média",
      value: metrics.averageRating.toFixed(1),
      category: "Satisfação"
    },
    {
      name: "NPS Score",
      value: Math.round(metrics.npsScore),
      category: "Engajamento"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metricItems.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
              <div className="flex items-center text-gray-500">
                {getTrend(Number(metric.value)) === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : getTrend(Number(metric.value)) === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.category}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
