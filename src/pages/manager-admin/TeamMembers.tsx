import { Helmet } from "react-helmet-async";
import { BackButton } from "@/components/ui/back-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { MemberCard } from "@/components/admin/team/MemberCard";
import { DeleteMemberDialog } from "@/components/admin/team/DeleteMemberDialog";
import { TeamHeader } from "@/components/admin/team/TeamHeader";
import { LoadingState } from "@/components/admin/team/LoadingState";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { SpecialtiesList } from "@/components/admin/specialties/SpecialtiesList";
import type { TeamMember } from "@/types/team";

const TeamMembers = () => {
  const {
    members,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSpecialtyFormOpen,
    setIsSpecialtyFormOpen,
    selectedMember,
    setSelectedMember,
    handleEdit,
    handleDelete,
    refetch
  } = useTeamMembers();

  return (
    <>
      <Helmet>
        <title>ElevaTI - Gestão de Membros</title>
        <meta 
          name="description" 
          content="Gerenciamento de membros da equipe ElevaTI" 
        />
      </Helmet>

      <BackButton />

      <TeamHeader
        onAddMember={() => setIsFormOpen(true)}
        onManageSpecialties={() => setIsSpecialtyFormOpen(true)}
      />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members?.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onDelete={(member: TeamMember) => {
                setSelectedMember(member);
                setIsDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? "Editar Membro" : "Novo Membro"}
            </DialogTitle>
            <DialogDescription>
              {selectedMember 
                ? "Atualize as informações do membro da equipe" 
                : "Preencha as informações para adicionar um novo membro à equipe"}
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            member={selectedMember}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedMember(null);
            }}
            onSuccess={refetch}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSpecialtyFormOpen} onOpenChange={setIsSpecialtyFormOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Especialidades</DialogTitle>
            <DialogDescription>
              Gerencie as especialidades disponíveis para os membros da equipe
            </DialogDescription>
          </DialogHeader>
          <SpecialtiesList />
        </DialogContent>
      </Dialog>

      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => selectedMember?.id && handleDelete(selectedMember.id)}
      />
    </>
  );
};

export default TeamMembers;
