import { useState } from "react";
import type { Service } from "@/types/service";

export const useServiceMutation = (refetch: () => void) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleCreateOrUpdate = async (service: Service) => {
    // Implementation details...
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedService,
    setSelectedService,
    handleCreateOrUpdate
  };
};
