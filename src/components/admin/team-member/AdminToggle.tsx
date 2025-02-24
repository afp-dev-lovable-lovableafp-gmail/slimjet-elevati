
import { Switch } from "@/components/ui/switch";

interface AdminToggleProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const AdminToggle = ({ isAdmin, setIsAdmin }: AdminToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="admin-status"
        checked={isAdmin}
        onCheckedChange={setIsAdmin}
      />
      <label
        htmlFor="admin-status"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Administrador
      </label>
    </div>
  );
};
