
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp } from "lucide-react";

interface AnalyticsData {
  date: string;
  value: number;
}

interface Prediction {
  date: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
}

const PredictiveAnalytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-trends'],
    queryFn: async () => {
      const { data: metrics, error } = await supabase
        .from('analytics_metrics')
        .select('value, date')
        .order('date', { ascending: true })
        .limit(30);

      if (error) throw error;

      // Transformar dados para o formato esperado pelo gráfico
      return metrics.map(metric => ({
        date: new Date(metric.date).toLocaleDateString('pt-BR'),
        value: metric.value,
        predicted: metric.value * 1.1, // Simulação simples de previsão
        lower_bound: metric.value * 0.9,
        upper_bound: metric.value * 1.2
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Análise Preditiva e Tendências
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                name="Valor Real"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#82ca9d"
                name="Previsão"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="upper_bound"
                stroke="#ffc658"
                name="Limite Superior"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="lower_bound"
                stroke="#ff7300"
                name="Limite Inferior"
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          * As previsões são baseadas em tendências históricas e podem variar
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
