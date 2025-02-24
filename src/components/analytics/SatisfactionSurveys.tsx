
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FeedbackData {
  rating: number;
  sentiment: string;
  comment: string;
  created_at: string;
}

interface SatisfactionSurveysProps {
  feedbacks: FeedbackData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SatisfactionSurveys = ({ feedbacks }: SatisfactionSurveysProps) => {
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
    rating: i + 1,
    count: feedbacks?.filter(d => d.rating === i + 1).length || 0
  }));

  const sentimentDistribution = feedbacks?.reduce((acc, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(sentimentDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Análise de Satisfação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-[300px]">
            <h3 className="text-sm font-medium mb-4">Distribuição de Avaliações</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

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
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-4">Comentários Recentes</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {feedbacks?.slice(0, 5).map((feedback, index) => (
              <div 
                key={index} 
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">{feedback.rating}/5</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    feedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    feedback.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {feedback.sentiment}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{feedback.comment}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(feedback.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SatisfactionSurveys;
