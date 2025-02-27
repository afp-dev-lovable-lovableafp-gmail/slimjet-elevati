
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { TeamMemberFormData } from "@/types/team";
import { z } from "zod";

const teamMemberSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  middle_name: z.string().optional(),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  position: z.string().min(2, "Cargo deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  linkedin_url: z.string().url("URL do LinkedIn inválida").optional().or(z.literal(""))
});

export const useTeamMemberFormActions = () => {
  const [loading, setLoading] = useState(false);

  const validateFormData = (formData: TeamMemberFormData) => {
    try {
      return teamMemberSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message).join(", ");
        throw new Error(`Validação falhou: ${errors}`);
      }
      throw error;
    }
  };

  const saveTeamMember = async (formData: TeamMemberFormData) => {
    const validatedData = validateFormData(formData);
    
    const baseData = {
      first_name: validatedData.first_name,
      middle_name: validatedData.middle_name,
      last_name: validatedData.last_name,
      position: validatedData.position,
      description: validatedData.description,
      linkedin_url: validatedData.linkedin_url
    };

    if (formData.id) {
      const { data, error } = await supabase
        .from('team_members')
        .update(baseData)
        .eq('id', formData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{ ...baseData, status: 'active' }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  };

  const handleSubmit = async (formData: TeamMemberFormData, isEditing: boolean) => {
    try {
      setLoading(true);
      
      await saveTeamMember(formData);
      
      toast(isEditing ? "Membro atualizado" : "Membro adicionado", {
        description: isEditing 
          ? "As informações foram atualizadas com sucesso"
          : "Novo membro adicionado com sucesso"
      });

      return true;
    } catch (error: any) {
      console.error("[TeamMember] Erro ao salvar:", error);
      toast("Erro ao salvar", {
        description: error.message || "Ocorreu um erro ao tentar salvar as informações"
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
