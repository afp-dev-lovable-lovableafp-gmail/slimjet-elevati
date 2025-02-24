
import { useEffect, useState } from "react";
import type { TeamMemberFormData } from "@/types/team";

export const useTeamMemberValidation = (formData: Partial<TeamMemberFormData>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Validação dos campos obrigatórios
    if (!formData.first_name?.trim()) {
      newErrors.first_name = "Nome é obrigatório";
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = "Sobrenome é obrigatório";
    }
    if (!formData.position?.trim()) {
      newErrors.position = "Cargo é obrigatório";
    }

    // Validação do LinkedIn URL (se fornecido)
    if (formData.linkedin_url && !formData.linkedin_url.includes('linkedin.com')) {
      newErrors.linkedin_url = "URL do LinkedIn inválida";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  return {
    errors,
    isValid
  };
};
