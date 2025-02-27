
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Appointment } from "@/types/appointment";

export const useAppointmentQuery = (appointmentId?: string) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error("ID do agendamento não fornecido");

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          services:service_id(*),
          profiles:user_id(*)
        `)
        .eq("id", appointmentId);

      if (error) {
        console.error("Erro ao buscar agendamento:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("Agendamento não encontrado");
      }

      // Converter dados para o tipo Appointment
      const appointments = data.map((item) => ({
        ...item,
        services: item.services || undefined,
        profiles: item.profiles || undefined
      })) as unknown as Appointment[];

      return appointments[0];
    },
    enabled: !!appointmentId,
  });
};
