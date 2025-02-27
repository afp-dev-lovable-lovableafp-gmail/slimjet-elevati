import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client } from "@/types/auth";

interface ProfileFormFieldsProps {
  profile: Client;
  onProfileChange: (profile: Client) => void;
}

const ProfileFormFields = ({ profile, onProfileChange }: ProfileFormFieldsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onProfileChange({
      ...profile,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input
          id="full_name"
          name="full_name"
          value={profile.full_name || ""}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="company_name">Empresa</Label>
        <Input
          id="company_name"
          name="company_name"
          value={profile.company_name || ""}
          onChange={handleChange}
          placeholder="Nome da sua empresa"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>
    </div>
  );
};

export default ProfileFormFields; 