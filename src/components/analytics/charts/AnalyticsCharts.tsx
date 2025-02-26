
import HeatMapChart from "../HeatMapChart";
import NpsChart from "../NpsChart";
import type { PageVisit, NpsData } from "@/types/analytics";

interface AnalyticsChartsProps {
  heatMapData: any[];
  npsChartData: { date: string; score: number }[];
}

export const AnalyticsCharts = ({ heatMapData, npsChartData }: AnalyticsChartsProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <HeatMapChart
        data={heatMapData}
        title="Mapa de Calor - Horários Populares"
      />
      <NpsChart data={npsChartData} />
    </div>
  );
};
