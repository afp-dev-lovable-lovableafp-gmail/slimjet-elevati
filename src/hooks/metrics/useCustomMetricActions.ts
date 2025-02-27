
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { DbCustomMetric } from "@/types/analytics";

type CreateCustomMetricDTO = Omit<DbCustomMetric, 'id' | 'created_at' | 'updated_at'> & {
  metric_type: string;
  name: string;
};

export const useCustomMetricActions = () => {
  const queryClient = useQueryClient();

  const createMetric = useMutation({
    mutationFn: async (data: CreateCustomMetricDTO) => {
      const { error } = await supabase
        .from('custom_metrics')
        .insert(data);

      if (error) {
        console.error('[CustomMetric] Erro ao criar:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica criada com sucesso!");
    },
    onError: (error: Error) => {
      console.error('[CustomMetric] Erro ao criar:', error);
      toast.error("Erro ao criar métrica");
    }
  });

  const updateMetric = useMutation({
    mutationFn: async ({ id, ...data }: DbCustomMetric) => {
      const { error } = await supabase
        .from('custom_metrics')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('[CustomMetric] Erro ao atualizar:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica atualizada com sucesso!");
    },
    onError: (error: Error) => {
      console.error('[CustomMetric] Erro ao atualizar:', error);
      toast.error("Erro ao atualizar métrica");
    }
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_metrics')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('[CustomMetric] Erro ao excluir:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica excluída com sucesso!");
    },
    onError: (error: Error) => {
      console.error('[CustomMetric] Erro ao excluir:', error);
      toast.error("Erro ao excluir métrica");
    }
  });

  return {
    createMetric,
    updateMetric,
    deleteMetric
  };
};
