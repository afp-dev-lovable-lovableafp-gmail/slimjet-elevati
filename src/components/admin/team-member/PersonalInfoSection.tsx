
import { Input } from "@/components/ui/input";
import type { TeamMemberFormData } from "@/types/team";

interface PersonalInfoSectionProps {
  formData: Partial<TeamMemberFormData>;
  updateFormData: (data: Partial<TeamMemberFormData>) => void;
  errors: Record<string, string>;
}

export const PersonalInfoSection = ({ 
  formData, 
  updateFormData, 
  errors 
}: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Informações Pessoais</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primeiro Nome</label>
          <Input
            value={formData.first_name || ''}
            onChange={(e) => updateFormData({ first_name: e.target.value })}
            placeholder="Primeiro Nome"
          />
          {errors.first_name && (
            <span className="text-xs text-red-500">{errors.first_name}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Meio</label>
          <Input
            value={formData.middle_name || ''}
            onChange={(e) => updateFormData({ middle_name: e.target.value })}
            placeholder="Nome do Meio (opcional)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Último Nome</label>
          <Input
            value={formData.last_name || ''}
            onChange={(e) => updateFormData({ last_name: e.target.value })}
            placeholder="Último Nome"
          />
          {errors.last_name && (
            <span className="text-xs text-red-500">{errors.last_name}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cargo</label>
          <Input
            value={formData.position || ''}
            onChange={(e) => updateFormData({ position: e.target.value })}
            placeholder="Cargo"
          />
          {errors.position && (
            <span className="text-xs text-red-500">{errors.position}</span>
          )}
        </div>
      </div>
    </div>
  );
};
