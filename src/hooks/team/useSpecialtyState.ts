
import { useState } from "react";
import type { Specialty } from "@/types/team";

export const useSpecialtyState = () => {
  const [isSpecialtyFormOpen, setIsSpecialtyFormOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const openSpecialtyForm = (specialty?: Specialty) => {
    if (specialty) {
      setSelectedSpecialty(specialty);
    }
    setIsSpecialtyFormOpen(true);
  };

  const closeSpecialtyForm = () => {
    setIsSpecialtyFormOpen(false);
    setSelectedSpecialty(null);
  };

  return {
    isSpecialtyFormOpen,
    setIsSpecialtyFormOpen,
    selectedSpecialty,
    setSelectedSpecialty,
    openSpecialtyForm,
    closeSpecialtyForm,
  };
};
