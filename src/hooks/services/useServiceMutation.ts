
import { useState } from "react";
import type { Service } from "@/types/service";
import { logger } from "@/features/logging/logger";
import { toAppError } from "@/types/extended-error";

export const useServiceMutation = (refetch: () => void) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleCreateOrUpdate = async (service: Service) => {
    try {
      // Implementation details...
      await refetch();
    } catch (err) {
      const appError = toAppError(err, {
        serviceId: service.id,
        name: service.name
      });
      
      logger.error("services", "Error managing service", appError);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedService,
    setSelectedService,
    handleCreateOrUpdate
  };
};
