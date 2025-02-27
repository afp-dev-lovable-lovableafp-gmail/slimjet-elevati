
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export const useAdminAppointments = () => {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          services:service_id(*),
          profiles:user_id(*)
        `)
        .order("scheduled_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar agendamentos:", error);
        throw error;
      }

      return data.map((appointment) => ({
        ...appointment,
        services: appointment.services,
        profiles: appointment.profiles,
      })) as unknown as Appointment[];
    },
  });

  const updateAppointmentStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AppointmentStatus;
    }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      toast.success("Status do agendamento atualizado com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do agendamento");
    },
  });

  const addMeetingLink = useMutation({
    mutationFn: async ({
      id,
      meeting_url,
    }: {
      id: string;
      meeting_url: string;
    }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ meeting_url })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
      toast.success("Link de reunião adicionado com sucesso");
    },
    onError: (error: any) => {
      console.error("Erro ao adicionar link:", error);
      toast.error("Erro ao adicionar link de reunião");
    },
  });

  return {
    appointments,
    isLoading,
    error,
    updateAppointmentStatus,
    addMeetingLink,
  };
};
