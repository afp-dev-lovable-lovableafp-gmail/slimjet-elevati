
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TeamMemberFormData, Specialty } from "@/types/team";

interface ProfessionalInfoSectionProps {
  formData: Partial<TeamMemberFormData>;
  updateFormData: (data: Partial<TeamMemberFormData>) => void;
  errors: Record<string, string>;
  specialties: Specialty[];
  selectedSpecialties: string[];
  setSelectedSpecialties: (specialties: string[]) => void;
  onPhotoChange: (file: File) => void;
}

export const ProfessionalInfoSection = ({
  formData,
  updateFormData,
  errors,
  specialties,
  selectedSpecialties,
  setSelectedSpecialties,
  onPhotoChange,
}: ProfessionalInfoSectionProps) => {
  const handleSpecialtyToggle = (specialtyId: string) => {
    if (selectedSpecialties.includes(specialtyId)) {
      setSelectedSpecialties(selectedSpecialties.filter(id => id !== specialtyId));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Informações Profissionais</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Descrição profissional"
            rows={4}
          />
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description}</span>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">LinkedIn</label>
          <Input
            value={formData.linkedin_url || ''}
            onChange={(e) => updateFormData({ linkedin_url: e.target.value })}
            placeholder="Username do LinkedIn"
            type="url"
          />
          {errors.linkedin_url && (
            <span className="text-xs text-red-500">{errors.linkedin_url}</span>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Foto</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPhotoChange(file);
            }}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Especialidades</label>
          <div className="flex flex-wrap gap-2">
            {specialties?.map((specialty) => (
              <Button
                key={specialty.id}
                type="button"
                variant={selectedSpecialties.includes(specialty.id) ? "default" : "outline"}
                onClick={() => handleSpecialtyToggle(specialty.id)}
                className={cn(
                  "text-sm",
                  selectedSpecialties.includes(specialty.id) && "bg-primary text-primary-foreground"
                )}
              >
                {specialty.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
