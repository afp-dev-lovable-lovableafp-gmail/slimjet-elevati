
import type { FeedbackData } from '../types';

interface RecentCommentsProps {
  feedbacks: FeedbackData[];
}

export const RecentComments = ({ feedbacks }: RecentCommentsProps) => {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-4">Comentários Recentes</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {feedbacks?.filter(f => f.comment).slice(0, 5).map((feedback, index) => (
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
  );
};
