
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ServiceStatusToggleProps {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

export const ServiceStatusToggle = ({
  isActive,
  setIsActive
}: ServiceStatusToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="service-status"
        checked={isActive}
        onCheckedChange={setIsActive}
      />
      <Label htmlFor="service-status">Ativo</Label>
    </div>
  );
};
