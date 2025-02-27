
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { TeamMember, DatabaseTeamMember } from "@/types/team";

export const useTeamMemberById = (memberId?: string) => {
  return useQuery({
    queryKey: ["team_member", memberId],
    queryFn: async () => {
      if (!memberId) {
        throw new Error("ID do membro da equipe não fornecido");
      }

      const { data, error } = await supabase
        .from("team_members")
        .select(
          `
          *,
          team_member_specialties(
            *,
            specialties(*)
          )
        `
        )
        .eq("id", memberId)
        .single();

      if (error) {
        console.error("Erro ao buscar membro da equipe:", error);
        throw error;
      }

      return data as unknown as TeamMember;
    },
    enabled: !!memberId,
  });
};

export const useTeamMembers = (active: boolean = true) => {
  return useQuery({
    queryKey: ["team_members", { active }],
    queryFn: async () => {
      let query = supabase
        .from("team_members")
        .select(
          `
          *,
          team_member_specialties(
            *,
            specialties(*)
          )
        `
        );

      if (active) {
        query = query.eq("status", "active");
      }

      const { data, error } = await query.order("first_name");

      if (error) {
        console.error("Erro ao buscar membros da equipe:", error);
        throw error;
      }

      return data as unknown as TeamMember[];
    },
  });
};
