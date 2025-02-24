
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeamMember } from "@/types/team";

export const useTeamMemberQueries = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team_member_specialties (
            id,
            specialty_id,
            specialties (
              id,
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;
      return data as TeamMember[];
    }
  });
};
