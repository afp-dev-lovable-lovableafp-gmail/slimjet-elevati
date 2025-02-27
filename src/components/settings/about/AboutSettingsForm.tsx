
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AboutBasicInfoFields from "./AboutBasicInfoFields";
import AboutHistoryFields from "./AboutHistoryFields";
import AboutMissionVisionFields from "./AboutMissionVisionFields";
import AboutValuesFields from "./AboutValuesFields";
import { AboutFormProps } from "./types";

const AboutSettingsForm = ({ 
  onSubmit, 
  formData, 
  valuesContent, 
  isSaving, 
  handleInputChange,
  handleValuesContentChange
}: AboutFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4">
        <AboutBasicInfoFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <AboutHistoryFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <AboutMissionVisionFields 
          formData={formData} 
          handleInputChange={handleInputChange} 
        />
        
        <AboutValuesFields 
          valuesTitle={formData.values_title}
          valuesContent={valuesContent}
          handleInputChange={handleInputChange}
          handleValuesContentChange={handleValuesContentChange}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default AboutSettingsForm;
