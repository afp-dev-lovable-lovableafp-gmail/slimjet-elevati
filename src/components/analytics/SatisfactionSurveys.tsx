
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RatingDistribution } from "./satisfaction/RatingDistribution";
import { SentimentDistribution } from "./satisfaction/SentimentDistribution";
import { RecentComments } from "./satisfaction/RecentComments";
import type { FeedbackData } from "./types";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";

interface SatisfactionSurveysProps {
  feedbacks: FeedbackData[];
}

const SatisfactionSurveys = ({ feedbacks }: SatisfactionSurveysProps) => {
  const hasFeedbacks = feedbacks && feedbacks.length > 0;
  const averageRating = hasFeedbacks 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
    : 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Análise de Satisfação</CardTitle>
        <div className="flex items-center space-x-2 bg-blue-50 rounded px-3 py-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{hasFeedbacks ? averageRating.toFixed(1) : "N/A"}</span>
          <span className="text-sm text-gray-500">/5</span>
        </div>
      </CardHeader>
      <CardContent>
        {hasFeedbacks ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <RatingDistribution feedbacks={feedbacks} />
              <SentimentDistribution feedbacks={feedbacks} />
            </div>
            <RecentComments feedbacks={feedbacks} />
          </>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Nenhum feedback disponível</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Ainda não há dados de satisfação para análise. Os feedbacks dos clientes serão exibidos aqui assim que estiverem disponíveis.
            </p>
            <Button variant="outline">
              Configurar Pesquisa de Satisfação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SatisfactionSurveys;
