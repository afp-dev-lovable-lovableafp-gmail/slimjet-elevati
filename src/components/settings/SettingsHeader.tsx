
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SettingsHeaderProps {
  handleLogout: () => Promise<void>;
}

export const SettingsHeader = ({ handleLogout }: SettingsHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as configurações do sistema
        </p>
      </div>
      <Button variant="destructive" onClick={handleLogout}>
        <SettingsIcon className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
};
