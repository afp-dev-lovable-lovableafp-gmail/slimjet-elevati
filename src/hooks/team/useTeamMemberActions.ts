
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { TeamMember } from "@/types/team";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

type RefetchFunction = (options?: RefetchOptions) => Promise<QueryObserverResult<TeamMember[], Error>>;

export const useTeamMemberActions = (refetchFn: RefetchFunction) => {
  const handleEdit = async (member: TeamMember) => {
    const { error } = await supabase
      .from('team_members')
      .update(member)
      .eq('id', member.id);

    if (error) {
      toast.error("Erro ao atualizar membro: " + error.message);
      throw error;
    }

    toast.success("Membro atualizado com sucesso!");
    await refetchFn();
  };

  const handleDelete = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'inactive' })
        .eq('id', memberId);

      if (error) throw error;

      toast.success("Membro removido com sucesso!");
      await refetchFn();
    } catch (error: any) {
      toast.error("Erro ao remover membro: " + error.message);
      throw error;
    }
  };

  return {
    handleEdit,
    handleDelete,
  };
};
