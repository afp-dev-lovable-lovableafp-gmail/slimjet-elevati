
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { 
  AnalyticsMetric, 
  CreateMetricDTO, 
  UpdateMetricDTO 
} from "@/types/analytics";

export const useMetricMutations = () => {
  const queryClient = useQueryClient();

  const createMetric = useMutation({
    mutationFn: async (data: CreateMetricDTO) => {
      const { error } = await supabase
        .from('custom_metrics')
        .insert({
          ...data,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Error creating metric:', error);
        throw error;
      }
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
    mutationFn: async (data: UpdateMetricDTO) => {
      const { error } = await supabase
        .from('custom_metrics')
        .update(data)
        .eq('id', data.id);

      if (error) {
        console.error('Error updating metric:', error);
        throw error;
      }
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
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting metric:', error);
        throw error;
      }
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

  const createMetricValue = useMutation({
    mutationFn: async (data: {
      custom_metric_id: string;
      value: number;
      change_percentage?: number;
    }) => {
      const { error } = await supabase
        .from('analytics_metrics')
        .insert({
          custom_metric_id: data.custom_metric_id,
          value: data.value,
          change_percentage: data.change_percentage,
          date: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating metric value:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      toast.success("Valor da métrica registrado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao registrar valor da métrica");
      console.error(error);
    }
  });

  const updateMetricValue = useMutation({
    mutationFn: async (data: AnalyticsMetric) => {
      const { error } = await supabase
        .from('analytics_metrics')
        .update({
          value: data.value,
          change_percentage: data.change_percentage
        })
        .eq('id', data.id);

      if (error) {
        console.error('Error updating metric value:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      toast.success("Valor da métrica atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar valor da métrica");
      console.error(error);
    }
  });

  return {
    createMetric,
    updateMetric,
    deleteMetric,
    createMetricValue,
    updateMetricValue
  };
};
