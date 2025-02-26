
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

interface FeedbackFormProps {
  /** ID do agendamento relacionado ao feedback */
  appointmentId: string;
  /** Função chamada após envio bem-sucedido do feedback */
  onSuccess?: () => void;
}

interface FeedbackInput {
  /** Avaliação numérica (1-5) */
  rating: number;
  /** Comentário opcional do usuário */
  comment: string;
}

/**
 * Formulário para coleta de feedback dos usuários após um serviço.
 * Permite avaliação por estrelas (1-5) e comentários opcionais.
 * 
 * @example
 * ```tsx
 * <FeedbackForm 
 *   appointmentId="123"
 *   onSuccess={() => console.log('Feedback enviado!')}
 * />
 * ```
 */
export const FeedbackForm = ({ appointmentId, onSuccess }: FeedbackFormProps) => {
  const [rating, setRating] = useState(0);
  const { register, handleSubmit } = useForm<FeedbackInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FeedbackInput) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('feedbacks')
        .insert([{
          appointment_id: appointmentId,
          rating: rating,
          comment: data.comment
        }]);

      if (error) throw error;

      toast.success("Feedback enviado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error("Erro ao enviar feedback: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Avalie seu atendimento</CardTitle>
        <CardDescription>
          Sua opinião é muito importante para melhorarmos nossos serviços
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Avaliação</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className={`p-2 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <StarIcon className="h-6 w-6" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comentário (opcional)</label>
            <Textarea
              {...register("comment")}
              placeholder="Conte-nos mais sobre sua experiência..."
              className="min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
