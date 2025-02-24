
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Appointment, AppointmentFilters } from "@/types/appointment";

export const useAppointmentQueries = (userId?: string, filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', userId, filters],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          services (
            id,
            name,
            duration,
            price
          ),
          profiles (
            id,
            full_name,
            company_name
          )
        `);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }

      if (filters?.startDate) {
        query = query.gte('scheduled_at', filters.startDate.toISOString());
      }

      if (filters?.endDate) {
        query = query.lte('scheduled_at', filters.endDate.toISOString());
      }

      if (filters?.serviceId) {
        query = query.eq('service_id', filters.serviceId);
      }

      const { data, error } = await query.order('scheduled_at');

      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!userId
  });
};
