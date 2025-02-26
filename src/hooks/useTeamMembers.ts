
import { useCallback } from "react";
import { useTeamMemberQueries } from "./team/useTeamMemberQueries";
import { useTeamMemberMutations } from "./team/useTeamMemberMutations";
import { useTeamMemberState } from "./team/useTeamMemberState";
import { useSpecialtyState } from "./team/useSpecialtyState";
import { useTeamMemberActions } from "./team/useTeamMemberActions";
import type { TeamMember } from "@/types/team";

export const useTeamMembers = () => {
  const { data: members, isLoading, error, refetch } = useTeamMemberQueries();
  const { deleteMember } = useTeamMemberMutations();
  const memberState = useTeamMemberState();
  const specialtyState = useSpecialtyState();
  const { handleEdit } = useTeamMemberActions(refetch);

  const handleDelete = useCallback(async (memberId: string) => {
    await deleteMember.mutateAsync(memberId);
    memberState.closeDeleteDialog();
  }, [deleteMember, memberState.closeDeleteDialog]);

  return {
    // Data
    members,
    isLoading,
    error,
    refetch,
    
    // Form state
    isFormOpen: memberState.isFormOpen,
    selectedMember: memberState.selectedMember,
    
    // Dialog state
    isDeleteDialogOpen: memberState.isDeleteDialogOpen,
    
    // Specialty state
    isSpecialtyFormOpen: specialtyState.isSpecialtyFormOpen,
    selectedSpecialty: specialtyState.selectedSpecialty,
    
    // Actions
    handleEdit,
    handleDelete,
    
    // State setters
    setIsFormOpen: memberState.setIsFormOpen,
    setSelectedMember: memberState.setSelectedMember,
    setIsDeleteDialogOpen: memberState.setIsDeleteDialogOpen,
    setIsSpecialtyFormOpen: specialtyState.setIsSpecialtyFormOpen,
    setSelectedSpecialty: specialtyState.setSelectedSpecialty
  };
};
