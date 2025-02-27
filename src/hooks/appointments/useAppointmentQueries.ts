
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Appointment } from "@/types/appointment";

export const useAppointmentQueries = () => {
  const { user } = useAuth();

  // Query para buscar todos os agendamentos do usuário atual
  const useUserAppointments = () => {
    return useQuery({
      queryKey: ["appointments", "user", user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error("Usuário não autenticado");

        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            services:service_id(*),
            profiles:user_id(*)
          `)
          .eq("user_id", user.id)
          .order("scheduled_at", { ascending: true });

        if (error) {
          console.error("Erro ao buscar agendamentos:", error);
          throw error;
        }

        // Converter dados para o tipo Appointment
        const appointments = data.map((item) => ({
          ...item,
          services: item.services || undefined,
          profiles: item.profiles || undefined
        })) as unknown as Appointment[];

        return appointments;
      },
      enabled: !!user?.id,
    });
  };

  // Query para buscar todos os agendamentos (admin)
  const useAllAppointments = () => {
    return useQuery({
      queryKey: ["appointments", "all"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            services:service_id(*),
            profiles:user_id(*)
          `)
          .order("scheduled_at", { ascending: true });

        if (error) {
          console.error("Erro ao buscar agendamentos:", error);
          throw error;
        }

        // Converter dados para o tipo Appointment
        const appointments = data.map((item) => ({
          ...item,
          services: item.services || undefined,
          profiles: item.profiles || undefined
        })) as unknown as Appointment[];

        return appointments;
      },
    });
  };

  return {
    useUserAppointments,
    useAllAppointments,
  };
};
