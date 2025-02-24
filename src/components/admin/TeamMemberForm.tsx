
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./team-member/PersonalInfoSection";
import { ProfessionalInfoSection } from "./team-member/ProfessionalInfoSection";
import { AdminToggle } from "./team-member/AdminToggle";
import { useTeamMemberForm } from "@/hooks/useTeamMemberForm";
import type { TeamMember } from "@/types/team";

interface TeamMemberFormProps {
  member?: TeamMember;
  onClose: () => void;
  onSuccess: () => void;
}

const TeamMemberForm = ({ member, onClose, onSuccess }: TeamMemberFormProps) => {
  const {
    formData,
    updateFormData,
    errors,
    loading,
    specialties,
    selectedSpecialties,
    setSelectedSpecialties,
    setPhotoFile,
    onSubmit,
    isAdmin,
    setIsAdmin,
  } = useTeamMemberForm(member, onSuccess, onClose);

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
      <div className="grid gap-6">
        <PersonalInfoSection
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
        />

        <ProfessionalInfoSection
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          specialties={specialties || []}
          selectedSpecialties={selectedSpecialties}
          setSelectedSpecialties={setSelectedSpecialties}
          onPhotoChange={setPhotoFile}
        />

        <AdminToggle
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-background py-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : member ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
