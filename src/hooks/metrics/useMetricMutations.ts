
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { mapToDbMetric } from "@/utils/metrics/metricMappers";
import type { CustomMetric } from "@/types/analytics";

export const useMetricMutations = () => {
  const queryClient = useQueryClient();

  const createMetric = useMutation({
    mutationFn: async (data: Omit<CustomMetric, 'id'>) => {
      const dbMetric = mapToDbMetric(data);
      const { error } = await supabase
        .from('custom_metrics')
        .insert(dbMetric);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      toast.success("Métrica criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar métrica");
      console.error(error);
    }
  });

  const updateMetric = useMutation({
    mutationFn: async (data: CustomMetric) => {
      const dbMetric = mapToDbMetric(data);
      const { error } = await supabase
        .from('custom_metrics')
        .update(dbMetric)
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      toast.success("Métrica atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar métrica");
      console.error(error);
    }
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      toast.success("Métrica removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover métrica");
      console.error(error);
    }
  });

  return {
    createMetric,
    updateMetric,
    deleteMetric
  };
};
