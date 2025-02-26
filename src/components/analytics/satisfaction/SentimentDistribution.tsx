
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { FeedbackData } from '../types';

interface SentimentDistributionProps {
  feedbacks: FeedbackData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const SentimentDistribution = ({ feedbacks }: SentimentDistributionProps) => {
  const sentimentDistribution = feedbacks?.reduce((acc, curr) => {
    if (curr.sentiment) {
      acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(sentimentDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="h-[300px]">
      <h3 className="text-sm font-medium mb-4">Análise de Sentimentos</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
