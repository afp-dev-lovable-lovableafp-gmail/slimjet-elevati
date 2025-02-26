
import MetricsCard from "../MetricsCard";
import type { MetricTrend } from "@/types/analytics";

interface MetricsOverviewProps {
  metrics: {
    totalPageViews: number;
    totalServices: number;
    averageRating: number;
    npsScore: number;
  };
  getTrend: (value: number) => MetricTrend;
}

export const MetricsOverview = ({ metrics, getTrend }: MetricsOverviewProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Total de Visualizações"
        value={metrics.totalPageViews}
        trend={getTrend(12)}
      />
      <MetricsCard
        title="Serviços Ativos"
        value={metrics.totalServices}
        trend={getTrend(8)}
      />
      <MetricsCard
        title="Avaliação Média"
        value={Number(metrics.averageRating.toFixed(1))}
        description="de 5 estrelas"
      />
      <MetricsCard
        title="NPS Score"
        value={Math.round(metrics.npsScore)}
        trend={getTrend(5)}
      />
    </div>
  );
};
