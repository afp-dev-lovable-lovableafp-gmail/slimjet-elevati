
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "@/types/appointment";

export const useAppointmentMutations = (userId?: string) => {
  const queryClient = useQueryClient();

  const createAppointment = useMutation({
    mutationFn: async (data: CreateAppointmentDTO) => {
      const { error } = await supabase
        .from('appointments')
        .insert({
          ...data,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar agendamento");
      console.error(error);
    }
  });

  const updateAppointment = useMutation({
    mutationFn: async (data: UpdateAppointmentDTO) => {
      const { error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar agendamento");
      console.error(error);
    }
  });

  const cancelAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', userId] });
      toast.success("Agendamento cancelado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao cancelar agendamento");
      console.error(error);
    }
  });

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment
  };
};
