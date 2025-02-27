
import { Loader2 } from "lucide-react";
import type { AnalyticsResponse } from "@/types/analytics";
import { calculateMetrics, getTrend, formatNpsChartData, getHeatMapData } from "@/utils/analytics/dataTransformers";
import { AnalyticsHeader } from "../header/AnalyticsHeader";
import { MetricsOverview } from "../metrics/MetricsOverview";
import { AnalyticsCharts } from "../charts/AnalyticsCharts";

interface AnalyticsOverviewProps {
  analytics: AnalyticsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export const AnalyticsOverview = ({ 
  analytics, 
  isLoading, 
  isError, 
  dateRange, 
  onDateRangeChange 
}: AnalyticsOverviewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar dados analíticos. Por favor, tente novamente.
      </div>
    );
  }

  const metrics = calculateMetrics(
    analytics.pageVisits, 
    analytics.popularServices.length,
    analytics.feedbacks,
    analytics.npsData
  );

  const npsChartData = formatNpsChartData(analytics.npsData);
  const heatMapData = getHeatMapData(analytics.pageVisits);

  return (
    <>
      <AnalyticsHeader 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
      />

      <MetricsOverview 
        metrics={metrics}
        getTrend={getTrend}
      />

      <AnalyticsCharts 
        heatMapData={heatMapData} 
        npsChartData={npsChartData} 
      />
    </>
  );
};
