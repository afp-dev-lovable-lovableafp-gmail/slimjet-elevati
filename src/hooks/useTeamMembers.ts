
import { useCallback } from "react";
import { useTeamMemberQueries } from "./team/useTeamMemberQueries";
import { useTeamMemberMutations } from "./team/useTeamMemberMutations";
import { useTeamMemberState } from "./team/useTeamMemberState";
import { useSpecialtyState } from "./team/useSpecialtyState";
import type { TeamMember } from "@/types/team";

export const useTeamMembers = () => {
  const { data: members, isLoading, error, refetch } = useTeamMemberQueries();
  const { deleteMember } = useTeamMemberMutations();
  const {
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
  } = useTeamMemberState();
  
  const {
    isSpecialtyFormOpen,
    setIsSpecialtyFormOpen,
    selectedSpecialty,
    setSelectedSpecialty,
  } = useSpecialtyState();

  const handleDelete = useCallback(async (memberId: string) => {
    await deleteMember.mutateAsync(memberId);
    closeDeleteDialog();
  }, [deleteMember, closeDeleteDialog]);

  const handleEdit = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    openForm();
  }, [setSelectedMember, openForm]);

  return {
    members,
    isLoading,
    error,
    refetch,
    isFormOpen,
    setIsFormOpen,
    selectedMember,
    setSelectedMember,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSpecialtyFormOpen,
    setIsSpecialtyFormOpen,
    selectedSpecialty,
    setSelectedSpecialty,
    handleEdit,
    handleDelete
  };
};
