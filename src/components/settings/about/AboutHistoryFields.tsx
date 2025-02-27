
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AboutFormData } from "./types";

interface AboutHistoryFieldsProps {
  formData: AboutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AboutHistoryFields = ({ formData, handleInputChange }: AboutHistoryFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="history_title">Título da História</Label>
        <Input
          id="history_title"
          value={formData.history_title}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="history_content">Conteúdo da História</Label>
        <Textarea
          id="history_content"
          rows={5}
          value={formData.history_content}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default AboutHistoryFields;
