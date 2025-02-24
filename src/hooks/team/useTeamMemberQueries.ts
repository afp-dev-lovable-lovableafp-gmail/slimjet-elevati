
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeamMember, TeamMemberSpecialty } from "@/types/team";

interface DatabaseTeamMember {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  position: string;
  description: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  status: 'active' | 'inactive';
  is_admin: boolean;
  team_member_specialties: {
    id: string;
    specialty_id: string;
    team_member_id: string;
    specialties: {
      id: string;
      name: string;
    };
  }[];
}

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
            team_member_id,
            specialties (
              id,
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('first_name');

      if (error) throw error;

      const formattedData = (data as DatabaseTeamMember[]).map(member => ({
        ...member,
        team_member_specialties: member.team_member_specialties.map(specialty => ({
          id: specialty.id,
          team_member_id: specialty.team_member_id,
          specialty_id: specialty.specialty_id,
          specialties: specialty.specialties
        }))
      })) as TeamMember[];

      return formattedData;
    }
  });
};
