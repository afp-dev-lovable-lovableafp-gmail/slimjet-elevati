
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MetricsChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const MetricsChart = ({ data }: MetricsChartProps) => {
  return (
    <div className="mt-8 h-[400px]">
      <h3 className="text-lg font-medium mb-4">Comparação de Métricas</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <YAxis tick={{ fill: 'currentColor' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;

