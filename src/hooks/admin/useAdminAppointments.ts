import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler";
import { ErrorCodes } from "@/types/error";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

const GC_TIME = 1000 * 60 * 5; // 5 minutes
const STALE_TIME = 1000 * 30; // 30 seconds

export const useAdminAppointments = () => {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      try {
        console.log("Buscando agendamentos...");
        
        const { data: appointmentsData, error } = await supabase
          .from("appointments")
          .select(`
            id,
            scheduled_at,
            status,
            meeting_url,
            notes,
            created_at,
            updated_at,
            services:service_id (
              id,
              name,
              duration,
              price
            ),
            profiles:user_id (
              id,
              full_name,
              company_name
            )
          `)
          .order("scheduled_at", { ascending: true });

        if (error) throw error;

        return appointmentsData as Appointment[];
      } catch (error) {
        throw handleError(error, ErrorCodes.APPOINTMENTS.FETCH_FAILED);
      }
    },
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    retry: 2
  });

  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Status atualizado com sucesso", {
        description: "O agendamento foi atualizado com sucesso"
      });
    } catch (error) {
      handleError(error, ErrorCodes.APPOINTMENTS.UPDATE_FAILED);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este agendamento?")) return;

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success("Agendamento excluído", {
        description: "O agendamento foi removido com sucesso."
      });
    } catch (error) {
      handleError(error, ErrorCodes.APPOINTMENTS.DELETE_FAILED);
    }
  };

  return {
    appointments,
    isLoading,
    handleStatusChange,
    handleDelete
  };
};