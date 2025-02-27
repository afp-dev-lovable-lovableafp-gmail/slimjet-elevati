
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ChartData {
  name: string;
  value: number;
}

const PredictiveAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState<ChartData[]>([]);
  const [conversions, setConversions] = useState<ChartData[]>([]);
  const [prediction, setPrediction] = useState<ChartData[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetching page visits data
      const { data: visitsData, error: visitsError } = await supabase
        .from('page_visits')
        .select('date, count')
        .order('date', { ascending: true });

      if (visitsError) throw visitsError;

      // Fetching conversion data (appointments per day)
      const { data: conversionData, error: conversionError } = await supabase
        .from('appointments')
        .select('scheduled_at, status')
        .order('scheduled_at', { ascending: true });

      if (conversionError) throw conversionError;

      // Process the visits data
      const processedVisits: ChartData[] = (visitsData || []).map(item => ({
        name: new Date(item.date).toLocaleDateString(),
        value: item.count
      }));

      // Process the conversions data (count appointments per day)
      const appointmentsByDay: Record<string, number> = {};
      const appointmentsData = conversionData || [];
      
      appointmentsData.forEach(appointment => {
        const date = new Date(appointment.scheduled_at).toLocaleDateString();
        appointmentsByDay[date] = (appointmentsByDay[date] || 0) + 1;
      });

      const processedConversions: ChartData[] = Object.entries(appointmentsByDay).map(
        ([date, count]) => ({
          name: date,
          value: count
        })
      );

      // Generate a simple prediction for the next 7 days
      const lastSevenVisits = Array.isArray(processedVisits) && processedVisits.length > 0
        ? processedVisits.slice(-7)
        : [];
      
      const averageVisits = lastSevenVisits.length > 0
        ? lastSevenVisits.reduce((sum, day) => sum + day.value, 0) / lastSevenVisits.length
        : 0;

      const conversionRate = processedConversions.length > 0 && processedVisits.length > 0
        ? processedConversions.length / processedVisits.length
        : 0.05; // default 5% conversion rate

      // Generate next 7 days prediction
      const predictionData: ChartData[] = [];
      const today = new Date();
      
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        const predictedVisits = Math.round(averageVisits * (1 + (i * 0.03))); // slight growth trend
        
        const filteredVisits = Array.isArray(lastSevenVisits) && lastSevenVisits.filter(v => v.value > 0).length > 0
          ? averageVisits
          : 10; // default if no data

        predictionData.push({
          name: futureDate.toLocaleDateString(),
          value: Math.round(filteredVisits * (1 + (i * 0.05))) // projected growth
        });
      }

      setVisits(processedVisits);
      setConversions(processedConversions);
      setPrediction(predictionData);
      
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Erro ao carregar dados analíticos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Previsão de Visitantes</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={loadData} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...visits, ...prediction]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  interval="preserveStartEnd" 
                />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Visitas']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Visitas Históricas"
                  dot={{ strokeWidth: 2 }}
                />
                {/* Linha de predição */}
                <Line
                  type="monotone"
                  dataKey="value"
                  data={prediction}
                  stroke="#82ca9d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predição"
                  dot={{ strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <span className="inline-block w-3 h-3 bg-[#8884d8] mr-2 rounded-full"></span>
            Visitas históricas
          </p>
          <p>
            <span className="inline-block w-3 h-3 bg-[#82ca9d] mr-2 rounded-full"></span>
            Previsão para os próximos 7 dias
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
