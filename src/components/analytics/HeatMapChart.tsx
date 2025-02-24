
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

interface HeatMapData {
  x: number;
  y: number;
  value: number;
}

interface HeatMapChartProps {
  data: HeatMapData[];
  title: string;
}

const HeatMapChart = ({ data, title }: HeatMapChartProps) => {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" name="hour" />
            <YAxis type="number" dataKey="y" name="day" />
            <ZAxis type="number" dataKey="value" range={[50, 500]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HeatMapChart;
