
import { useState, useCallback } from "react";
import { useTeamMemberFormState } from "./team/useTeamMemberFormState";
import { useTeamMemberValidation } from "./team/useTeamMemberValidation";
import { useTeamMemberFormActions } from "./team/useTeamMemberFormActions";
import { useSpecialties } from "./useSpecialties";
import { useToast } from "./use-toast";
import type { TeamMemberFormData, TeamMember } from "@/types/team";

export const useTeamMemberForm = (
  initialData?: Partial<TeamMember>,
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const { formData, updateFormData, resetFormData } = useTeamMemberFormState(initialData);
  const { errors, isValid } = useTeamMemberValidation(formData);
  const { loading, handleSubmit } = useTeamMemberFormActions();
  const { specialties } = useSpecialties();
  const { toast } = useToast();
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    initialData?.team_member_specialties?.map(s => s.specialty_id) || []
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isValid || !formData.first_name || !formData.last_name || !formData.position) {
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: "Por favor, preencha todos os campos obrigatórios"
        });
        return false;
      }

      const submitData: TeamMemberFormData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        position: formData.position,
        middle_name: formData.middle_name,
        description: formData.description,
        linkedin_url: formData.linkedin_url,
        id: formData.id,
        specialties: selectedSpecialties,
        photo_file: photoFile || undefined
      };

      const success = await handleSubmit(submitData, !!initialData?.id);
      if (success) {
        toast({
          title: "Sucesso",
          description: `Membro do time ${initialData?.id ? 'atualizado' : 'criado'} com sucesso`
        });
        onSuccess?.();
        if (!initialData?.id) {
          resetFormData();
        }
        onClose?.();
      }
      
      return success;
    } catch (error: any) {
      console.error('[TeamMemberForm] Erro:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o membro do time"
      });
      return false;
    }
  };

  return {
    formData,
    updateFormData,
    errors,
    isValid,
    loading,
    onSubmit,
    specialties,
    selectedSpecialties,
    setSelectedSpecialties,
    setPhotoFile
  };
};

export type { TeamMember, TeamMemberFormData };
