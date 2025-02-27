
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AboutFormData } from "./types";

interface AboutMissionVisionFieldsProps {
  formData: AboutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AboutMissionVisionFields = ({ formData, handleInputChange }: AboutMissionVisionFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mission_title">Título da Missão</Label>
        <Input
          id="mission_title"
          value={formData.mission_title}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission_content">Conteúdo da Missão</Label>
        <Textarea
          id="mission_content"
          rows={3}
          value={formData.mission_content}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision_title">Título da Visão</Label>
        <Input
          id="vision_title"
          value={formData.vision_title}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision_content">Conteúdo da Visão</Label>
        <Textarea
          id="vision_content"
          rows={3}
          value={formData.vision_content}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default AboutMissionVisionFields;
