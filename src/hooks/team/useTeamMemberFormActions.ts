
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { TeamMemberFormData } from "@/types/team";

export const useTeamMemberFormActions = () => {
  const [loading, setLoading] = useState(false);

  const createTeamMember = async (formData: TeamMemberFormData) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert([{
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        position: formData.position,
        description: formData.description,
        linkedin_url: formData.linkedin_url,
        is_admin: formData.is_admin,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateTeamMember = async (formData: TeamMemberFormData) => {
    if (!formData.id) throw new Error('ID is required for update');

    const { data, error } = await supabase
      .from('team_members')
      .update({
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        position: formData.position,
        description: formData.description,
        linkedin_url: formData.linkedin_url,
        is_admin: formData.is_admin
      })
      .eq('id', formData.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const handleSubmit = async (formData: TeamMemberFormData, isEditing: boolean) => {
    try {
      setLoading(true);
      
      if (isEditing && formData.id) {
        await updateTeamMember(formData);
        toast("Membro atualizado", {
          description: "As informações foram atualizadas com sucesso"
        });
      } else {
        await createTeamMember(formData);
        toast("Membro adicionado", {
          description: "Novo membro adicionado com sucesso"
        });
      }

      return true;
    } catch (error) {
      console.error("[TeamMember] Erro ao salvar:", error);
      toast("Erro ao salvar", {
        description: "Ocorreu um erro ao tentar salvar as informações"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
