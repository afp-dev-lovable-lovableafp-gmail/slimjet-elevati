
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

interface NpsTabContentProps {
  npsData: AnalyticsData[];
  npsStats: NpsStats;
}

const NpsTabContent = ({ npsData, npsStats }: NpsTabContentProps) => {
  return (
    <>
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
    </>
  );
};

export default NpsTabContent;
