
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { FeedbackData } from '../types';

interface RatingDistributionProps {
  feedbacks: FeedbackData[];
}

export const RatingDistribution = ({ feedbacks }: RatingDistributionProps) => {
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
    rating: i + 1,
    count: feedbacks?.filter(d => d.rating === i + 1).length || 0
  }));

  return (
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
  );
};
