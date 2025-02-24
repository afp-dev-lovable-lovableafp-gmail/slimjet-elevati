
import { PlusCircle, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicesHeaderProps {
  onNewService: () => void;
  onManageTags: () => void;
}

export const ServicesHeader = ({ onNewService, onManageTags }: ServicesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Serviços</h1>
        <p className="text-muted-foreground">
          Gerencie os serviços oferecidos pela empresa
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
          onClick={onManageTags} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Tags className="mr-2 h-4 w-4" />
          Gerenciar Tags
        </Button>
        <Button 
          onClick={onNewService}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Serviço
        </Button>
      </div>
    </div>
  );
};
