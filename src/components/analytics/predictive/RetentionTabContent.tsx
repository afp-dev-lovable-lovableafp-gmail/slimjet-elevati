
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalyticsData {
  date: string;
  value: number;
}

interface RetentionTabContentProps {
  retentionData: AnalyticsData[];
}

const RetentionTabContent = ({ retentionData }: RetentionTabContentProps) => {
  return (
    <>
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
    </>
  );
};

export default RetentionTabContent;
