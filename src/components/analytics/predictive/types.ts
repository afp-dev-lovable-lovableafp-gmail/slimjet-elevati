
export interface AnalyticsData {
  date: string;
  value: number;
}

export interface NpsStats {
  promoters: number;
  neutrals: number;
  detractors: number;
  total: number;
}

export const getDateRange = (timeRange: string) => {
  const endDate = new Date();
  const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);
  return { startDate, endDate };
};
