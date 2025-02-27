
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AboutFormData } from "./types";

interface AboutBasicInfoFieldsProps {
  formData: AboutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AboutBasicInfoFields = ({ formData, handleInputChange }: AboutBasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company_name">Nome da Empresa</Label>
        <Input
          id="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="page_title">Título da Página</Label>
        <Input
          id="page_title"
          value={formData.page_title}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default AboutBasicInfoFields;
