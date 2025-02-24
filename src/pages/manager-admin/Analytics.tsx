import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BackButton } from "@/components/ui/back-button";
import MetricsCard from "@/components/analytics/MetricsCard";
import HeatMapChart from "@/components/analytics/HeatMapChart";
import NpsChart from "@/components/analytics/NpsChart";
import CustomReports from "@/components/analytics/CustomReports";
import PredictiveAnalytics from "@/components/analytics/PredictiveAnalytics";
import SatisfactionSurveys from "@/components/analytics/SatisfactionSurveys";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { MetricTrend } from "@/types/analytics";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  const analytics = useAnalytics();

  const getTrend = (value: number): MetricTrend => {
    if (value > 0) return "up";
    if (value < 0) return "down";
    return "neutral";
  };

  if (analytics.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (analytics.isError) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar dados analíticos. Por favor, tente novamente.
      </div>
    );
  }

  const metrics = {
    totalPageViews: analytics.pageVisits.reduce((sum, visit) => sum + visit.count, 0),
    totalServices: analytics.popularServices.length,
    averageRating: analytics.feedbacks.length > 0 
      ? analytics.feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / analytics.feedbacks.length 
      : 0,
    npsScore: analytics.npsData.length > 0
      ? analytics.npsData.reduce((sum, n) => sum + (n.score || 0), 0) / analytics.npsData.length
      : 0
  };

  const npsChartData = analytics.npsData.map(nps => ({
    date: new Date(nps.created_at).toISOString().split('T')[0],
    score: nps.score
  }));

  const getHeatMapData = () => {
    const heatMapData = Array.from({ length: 24 }, (_, hour) =>
      Array.from({ length: 7 }, (_, day) => ({
        x: hour,
        y: day,
        value: 0
      }))
    ).flat();

    analytics.pageVisits.forEach(visit => {
      const hour = visit.visit_hour;
      const date = new Date(visit.visit_date);
      const day = date.getDay();
      const index = hour * 7 + day;
      if (heatMapData[index]) {
        heatMapData[index].value += visit.count;
      }
    });

    return heatMapData;
  };

  return (
    <>
      <Helmet>
        <title>ElevaTI - Analytics</title>
        <meta 
          name="description" 
          content="Analytics e métricas da plataforma ElevaTI" 
        />
      </Helmet>

      <BackButton />

      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            value={metrics.averageRating.toFixed(1)}
            description="de 5 estrelas"
          />
          <MetricsCard
            title="NPS Score"
            value={Math.round(metrics.npsScore)}
            trend={getTrend(5)}
          />
        </div>

        <PredictiveAnalytics />

        <div className="grid gap-6 lg:grid-cols-2">
          <HeatMapChart
            data={getHeatMapData()}
            title="Mapa de Calor - Horários Populares"
          />
          <NpsChart data={npsChartData} />
        </div>

        <SatisfactionSurveys feedbacks={analytics.feedbacks} />

        <CustomReports />
      </div>
    </>
  );
};

export default Analytics;
