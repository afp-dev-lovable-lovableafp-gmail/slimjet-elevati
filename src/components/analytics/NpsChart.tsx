
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface NpsData {
  date: string;
  score: number;
}

interface NpsChartProps {
  data: NpsData[];
}

const NpsChart = ({ data }: NpsChartProps) => {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Net Promoter Score (NPS)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[-100, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default NpsChart;
