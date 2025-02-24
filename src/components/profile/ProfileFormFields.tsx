
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

interface FormProfile {
  full_name: string;
  company_name: string | null;
  phone: string;
  avatar_url: string | null;
}

interface ProfileFormFieldsProps {
  profile: FormProfile;
  onProfileChange: (profile: FormProfile) => void;
  formatPhone: (value: string) => string;
}

const ProfileFormFields = ({ 
  profile, 
  onProfileChange, 
  formatPhone 
}: ProfileFormFieldsProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    onProfileChange({ ...profile, phone: formattedPhone });
  };

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nome Completo
        </label>
        <Input
          id="full_name"
          value={profile.full_name}
          onChange={(e) =>
            onProfileChange({ ...profile, full_name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="company_name" className="text-sm font-medium">
          Empresa
        </label>
        <Input
          id="company_name"
          value={profile.company_name || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, company_name: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Telefone
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="(99)99999-9999"
          value={profile.phone}
          onChange={handlePhoneChange}
          maxLength={14}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Senha</label>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Alterar Senha
        </Button>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export default ProfileFormFields;
