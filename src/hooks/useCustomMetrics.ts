
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CustomMetric, CreateCustomMetricDTO } from "@/types/custom-metric";

export const useCustomMetrics = () => {
  const queryClient = useQueryClient();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['custom-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom metrics:', error);
        throw error;
      }

      return data as CustomMetric[];
    },
  });

  const createMetric = useMutation({
    mutationFn: async (data: CreateCustomMetricDTO) => {
      const { error } = await supabase
        .from('custom_metrics')
        .insert(data);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica criada com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error creating custom metric:', error);
      toast.error("Erro ao criar métrica");
    },
  });

  const updateMetric = useMutation({
    mutationFn: async ({ id, ...data }: CustomMetric) => {
      const { error } = await supabase
        .from('custom_metrics')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica atualizada com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error updating custom metric:', error);
      toast.error("Erro ao atualizar métrica");
    },
  });

  const deleteMetric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_metrics')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-metrics'] });
      toast.success("Métrica removida com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error deleting custom metric:', error);
      toast.error("Erro ao remover métrica");
    },
  });

  return {
    metrics,
    isLoading,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
  };
};
