
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CustomReport } from "@/types/custom-report";

export const useCustomReports = () => {
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['custom-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching custom reports:', error);
        throw error;
      }

      return data as CustomReport[];
    },
  });

  const createReport = useMutation({
    mutationFn: async (data: Omit<CustomReport, "id">) => {
      const { error } = await supabase
        .from('custom_reports')
        .insert({
          ...data,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast.success("Relatório criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error creating custom report:', error);
      toast.error("Erro ao criar relatório");
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, ...data }: CustomReport) => {
      const { error } = await supabase
        .from('custom_reports')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast.success("Relatório atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error updating custom report:', error);
      toast.error("Erro ao atualizar relatório");
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_reports')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast.success("Relatório removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error deleting custom report:', error);
      toast.error("Erro ao remover relatório");
    },
  });

  return {
    reports,
    isLoading,
    error,
    createReport,
    updateReport,
    deleteReport,
  };
};
