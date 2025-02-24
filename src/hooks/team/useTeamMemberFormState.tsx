
import { useState } from "react";
import type { TeamMemberFormData } from "@/types/team";

export const useTeamMemberFormState = (initialData?: Partial<TeamMemberFormData>) => {
  const [formData, setFormData] = useState<Partial<TeamMemberFormData>>(initialData || {});

  const updateFormData = (data: Partial<TeamMemberFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialData || {});
  };

  return {
    formData,
    updateFormData,
    resetFormData
  };
};

