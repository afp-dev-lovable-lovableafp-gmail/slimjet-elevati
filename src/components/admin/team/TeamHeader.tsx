
import { Button } from "@/components/ui/button";
import { UserPlus, Wrench } from "lucide-react";

interface TeamHeaderProps {
  onAddMember: () => void;
  onManageSpecialties: () => void;
}

export const TeamHeader = ({ onAddMember, onManageSpecialties }: TeamHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Membros do Time</h1>
        <p className="text-muted-foreground">
          Gerencie os membros da equipe e suas especialidades
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onManageSpecialties} variant="outline">
          <Wrench className="mr-2 h-4 w-4" />
          Gerenciar Especialidades
        </Button>
        <Button onClick={onAddMember}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>
    </div>
  );
};
