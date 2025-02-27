
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CreateAppointmentDTO, UpdateAppointmentDTO, AppointmentStatus } from "@/types/appointment";

export const useAppointmentActions = (userId?: string) => {
  const queryClient = useQueryClient();

  // Mutation para criar um novo agendamento
  const createAppointment = useMutation({
    mutationFn: async (data: CreateAppointmentDTO) => {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase.from("appointments").insert([
        {
          user_id: data.user_id || userId,
          service_id: data.service_id,
          scheduled_at: data.scheduled_at,
          notes: data.notes || null,
          status: data.status || "pending",
        },
      ]);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar agendamento", {
        description: error.message,
      });
    },
  });

  // Mutation para atualizar um agendamento existente
  const updateAppointment = useMutation({
    mutationFn: async (data: UpdateAppointmentDTO) => {
      const { id, ...updateData } = data;
      
      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar agendamento", {
        description: error.message,
      });
    },
  });

  // Mutation para cancelar um agendamento
  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento cancelado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao cancelar agendamento", {
        description: error.message,
      });
    },
  });

  return {
    createAppointment,
    updateAppointment,
    cancelAppointment,
  };
};
