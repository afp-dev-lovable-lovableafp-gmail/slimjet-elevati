
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AnalyticsData {
  date: string;
  value: number;
}

interface ChurnTabContentProps {
  churnRiskData: AnalyticsData[];
}

const ChurnTabContent = ({ churnRiskData }: ChurnTabContentProps) => {
  return (
    <>
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
    </>
  );
};

export default ChurnTabContent;
