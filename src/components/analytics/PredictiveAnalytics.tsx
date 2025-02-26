
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartLine, TrendingUp, LineChart as LineChartIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { addDays, format, subDays } from "date-fns";

interface AnalyticsData {
  date: string;
  value: number;
}

interface NpsStats {
  promoters: number;
  neutrals: number;
  detractors: number;
  total: number;
}

const PredictiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [npsData, setNpsData] = useState<AnalyticsData[]>([]);
  const [retentionData, setRetentionData] = useState<AnalyticsData[]>([]);
  const [churnRiskData, setChurnRiskData] = useState<AnalyticsData[]>([]);
  const [npsStats, setNpsStats] = useState<NpsStats>({
    promoters: 0,
    neutrals: 0,
    detractors: 0,
    total: 0
  });

  const getDateRange = () => {
    const endDate = new Date();
    const days = timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
    const startDate = subDays(endDate, days);
    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const { startDate, endDate } = getDateRange();

      // Fetch NPS data
      const { data: npsResponses } = await supabase
        .from('nps_responses')
        .select('score, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (npsResponses) {
        // Calculate NPS stats
        const stats = npsResponses.reduce((acc, { score }) => {
          if (score >= 9) acc.promoters++;
          else if (score >= 7) acc.neutrals++;
          else acc.detractors++;
          acc.total++;
          return acc;
        }, { promoters: 0, neutrals: 0, detractors: 0, total: 0 });

        setNpsStats(stats);

        // Group NPS data by date
        const groupedNps = npsResponses.reduce((acc: Record<string, number[]>, curr) => {
          const date = format(new Date(curr.created_at), 'yyyy-MM-dd');
          if (!acc[date]) acc[date] = [];
          acc[date].push(curr.score);
          return acc;
        }, {});

        const npsDataPoints = Object.entries(groupedNps).map(([date, scores]) => ({
          date,
          value: scores.reduce((sum, score) => sum + score, 0) / scores.length
        }));

        setNpsData(npsDataPoints);
      }

      // Fetch feedback data for retention analysis
      const { data: feedbacks } = await supabase
        .from('feedbacks')
        .select('rating, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (feedbacks) {
        const groupedFeedbacks = feedbacks.reduce((acc: Record<string, number[]>, curr) => {
          const date = format(new Date(curr.created_at), 'yyyy-MM-dd');
          if (!acc[date]) acc[date] = [];
          acc[date].push(curr.rating);
          return acc;
        }, {});

        const retentionDataPoints = Object.entries(groupedFeedbacks).map(([date, ratings]) => ({
          date,
          value: (ratings.filter(r => r >= 4).length / ratings.length) * 100
        }));

        setRetentionData(retentionDataPoints);
      }

      // Fetch site analytics for churn risk estimation
      const { data: analytics } = await supabase
        .from('site_analytics')
        .select('count, visit_date')
        .gte('visit_date', startDate.toISOString())
        .lte('visit_date', endDate.toISOString())
        .order('visit_date');

      if (analytics) {
        const churnDataPoints = analytics.map(item => ({
          date: item.visit_date,
          value: Math.max(0, 30 - (item.count / 10)) // Exemplo de cálculo de risco
        }));

        setChurnRiskData(churnDataPoints);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Análises Preditivas</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nps">
          <TabsList className="mb-4">
            <TabsTrigger value="nps">
              <ChartLine className="mr-2 h-4 w-4" />
              NPS
            </TabsTrigger>
            <TabsTrigger value="retention">
              <TrendingUp className="mr-2 h-4 w-4" />
              Retenção
            </TabsTrigger>
            <TabsTrigger value="churn">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Risco de Churn
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="nps" className="h-[400px]">
            <div className="mb-4">
              <h3 className="font-medium">Net Promoter Score (NPS)</h3>
              <p className="text-sm text-gray-500">Evolução do NPS ao longo do tempo</p>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={npsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip formatter={(value: number) => [value.toFixed(1), 'NPS Score']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="NPS" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Promotores</p>
                <p className="text-xl font-bold">
                  {npsStats.total ? ((npsStats.promoters / npsStats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Neutros</p>
                <p className="text-xl font-bold">
                  {npsStats.total ? ((npsStats.neutrals / npsStats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Detratores</p>
                <p className="text-xl font-bold">
                  {npsStats.total ? ((npsStats.detractors / npsStats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="retention" className="h-[400px]">
            <div className="mb-4">
              <h3 className="font-medium">Taxa de Retenção</h3>
              <p className="text-sm text-gray-500">Percentual de clientes retidos</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [value.toFixed(1) + '%', 'Taxa de Retenção']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Retenção" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="churn" className="h-[400px]">
            <div className="mb-4">
              <h3 className="font-medium">Previsão de Churn</h3>
              <p className="text-sm text-gray-500">Probabilidade estimada de perda de clientes</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={churnRiskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 50]} />
                <Tooltip formatter={(value: number) => [value.toFixed(1) + '%', 'Risco de Churn']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Churn Risk" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
