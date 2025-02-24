
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeamMember, TeamMemberSpecialty } from "@/types/team";

export const useTeamMemberQuery = () => {
  const { 
    data: members, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team_member_specialties (
            id,
            team_member_id,
            specialty_id,
            specialties (
              id,
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = data?.map(member => ({
        ...member,
        team_member_specialties: member.team_member_specialties as TeamMemberSpecialty[]
      }));

      return transformedData as TeamMember[];
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    members,
    isLoading,
    error,
    refetch,
  };
};
