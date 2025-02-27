
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AboutValuesFieldsProps {
  valuesTitle: string;
  valuesContent: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleValuesContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AboutValuesFields = ({ 
  valuesTitle, 
  valuesContent, 
  handleInputChange,
  handleValuesContentChange
}: AboutValuesFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="values_title">Título dos Valores</Label>
        <Input
          id="values_title"
          value={valuesTitle}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="values_content">Valores (um por linha)</Label>
        <Textarea
          id="values_content"
          rows={5}
          value={valuesContent}
          onChange={handleValuesContentChange}
          placeholder="Digite um valor por linha"
        />
      </div>
    </>
  );
};

export default AboutValuesFields;
