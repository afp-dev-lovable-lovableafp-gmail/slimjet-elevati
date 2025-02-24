
import { useState } from "react";
import type { TeamMember } from "@/types/team";

export const useTeamMemberState = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const openForm = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMember(null);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedMember(null);
  };

  return {
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedMember,
    setSelectedMember,
    openForm,
    closeForm,
    openDeleteDialog,
    closeDeleteDialog,
  };
};
