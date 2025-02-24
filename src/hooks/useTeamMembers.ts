
import { useTeamMemberState } from "./team/useTeamMemberState";
import { useTeamMemberActions } from "./team/useTeamMemberActions";
import { useTeamMemberQuery } from "./team/useTeamMemberQuery";
import { useSpecialtyState } from "./team/useSpecialtyState";
import { useCallback } from "react";
import type { TeamMember } from "@/types/team";

export const useTeamMembers = () => {
  const { members, isLoading, error, refetch } = useTeamMemberQuery();
  const { handleDelete: deleteTeamMember } = useTeamMemberActions(refetch);
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
    await deleteTeamMember(memberId);
    closeDeleteDialog();
  }, [deleteTeamMember, closeDeleteDialog]);

  const handleEdit = useCallback((member: TeamMember) => {
    setSelectedMember(member);
    openForm();
  }, [setSelectedMember, openForm]);

  return {
    members,
    isLoading,
    error,
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
    handleDelete,
    refetch,
  };
};
