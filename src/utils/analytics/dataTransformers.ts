
import type { PageVisit, NpsData, MetricTrend } from "@/types/analytics";

export const getTrend = (value: number): MetricTrend => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};

export const calculateMetrics = (pageVisits: PageVisit[], servicesCount: number, feedbacks: { rating: number }[], npsData: NpsData[]) => {
  return {
    totalPageViews: pageVisits.reduce((sum, visit) => sum + visit.count, 0),
    totalServices: servicesCount,
    averageRating: feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length 
      : 0,
    npsScore: npsData.length > 0
      ? npsData.reduce((sum, n) => sum + (n.score || 0), 0) / npsData.length
      : 0
  };
};

export const formatNpsChartData = (npsData: NpsData[]) => {
  return npsData.map(nps => ({
    date: new Date(nps.created_at).toISOString().split('T')[0],
    score: nps.score
  }));
};

export const getHeatMapData = (pageVisits: PageVisit[]) => {
  const heatMapData = Array.from({ length: 24 }, (_, hour) =>
    Array.from({ length: 7 }, (_, day) => ({
      x: hour,
      y: day,
      value: 0
    }))
  ).flat();

  pageVisits.forEach(visit => {
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
