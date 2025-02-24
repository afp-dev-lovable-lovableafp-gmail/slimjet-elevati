
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Appointment } from "@/types/appointment";

export const useAppointmentQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['appointments', userId],
    queryFn: async () => {
      const query = supabase
        .from('appointments')
        .select(`
          *,
          services (*),
          profiles (
            id,
            full_name,
            company_name
          )
        `)
        .order('scheduled_at', { ascending: true });

      if (userId) {
        query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
