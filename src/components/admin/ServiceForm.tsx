
import { Button } from "@/components/ui/button";
import { ServiceFormFields } from "./services/ServiceFormFields";
import { ServiceTagsSelector } from "./services/ServiceTagsSelector";
import { ServiceStatusToggle } from "./services/ServiceStatusToggle";
import { useServiceForm } from "./services/useServiceForm";
import type { Service } from "@/types/service";

interface ServiceFormProps {
  service?: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceForm = ({ service, onClose, onSuccess }: ServiceFormProps) => {
  const {
    isLoading,
    isActive,
    setIsActive,
    selectedTags,
    toggleTag,
    register,
    errors,
    handleSubmit
  } = useServiceForm(service, onClose, onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ServiceFormFields register={register} errors={errors} />
      <ServiceTagsSelector
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
      />
      <ServiceStatusToggle
        isActive={isActive}
        setIsActive={setIsActive}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
