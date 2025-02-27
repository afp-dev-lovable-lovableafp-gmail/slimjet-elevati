
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { TeamMember, TeamMemberFormData } from "@/types/team";

export const useTeamMemberMutations = () => {
  const queryClient = useQueryClient();

  const createMember = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      const { error } = await supabase
        .from('team_members')
        .insert({
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          position: data.position,
          description: data.description,
          linkedin_url: data.linkedin_url,
          photo_url: data.photo_url,
          status: 'active'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success("Membro adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao adicionar membro");
      console.error(error);
    }
  });

  const updateMember = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      if (!data.id) throw new Error('ID é necessário para atualização');

      const { error } = await supabase
        .from('team_members')
        .update({
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          position: data.position,
          description: data.description,
          linkedin_url: data.linkedin_url,
          photo_url: data.photo_url
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success("Membro atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar membro");
      console.error(error);
    }
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success("Membro removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao remover membro");
      console.error(error);
    }
  });

  return {
    createMember,
    updateMember,
    deleteMember
  };
};
