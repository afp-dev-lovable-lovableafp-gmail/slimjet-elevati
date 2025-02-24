
import { useState, useCallback } from "react";
import type { TeamMemberFormData, TeamMember } from "@/types/team";

const initializeFormData = (initialData?: Partial<TeamMember>): Partial<TeamMemberFormData> => ({
  first_name: initialData?.first_name || '',
  middle_name: initialData?.middle_name || '',
  last_name: initialData?.last_name || '',
  position: initialData?.position || '',
  description: initialData?.description || '',
  linkedin_url: initialData?.linkedin_url || '',
  id: initialData?.id,
  specialties: [],
});

export const useTeamMemberFormState = (initialData?: Partial<TeamMember>) => {
  const [formData, setFormData] = useState<Partial<TeamMemberFormData>>(
    initializeFormData(initialData)
  );

  const updateFormData = useCallback((data: Partial<TeamMemberFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initializeFormData(initialData));
  }, [initialData]);

  return {
    formData,
    updateFormData,
    resetFormData
  };
};
