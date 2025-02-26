
import { useServiceMutation } from "./services/useServiceMutation";
import { useServiceDeletion } from "./services/useServiceDeletion";
import { useServiceStatus } from "./services/useServiceStatus";
import type { Service, ServiceOperations } from "@/types/service";
import { useCallback } from "react";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export const useServiceOperations = (refetch: () => void): ServiceOperations => {
  const mutation = useServiceMutation(refetch);
  const deletion = useServiceDeletion(refetch);
  const status = useServiceStatus(refetch);

  // Handler seguro para criar/atualizar serviço
  const handleCreateOrUpdate = useCallback(async (service: Partial<Service>) => {
    try {
      // Validação básica dos dados
      if (!service.name || !service.duration || service.price === undefined) {
        throw new Error("Dados incompletos do serviço");
      }

      const serviceData = service.id ? service : { ...service, id: crypto.randomUUID() };
      await mutation.handleCreateOrUpdate(serviceData as Service);
      
      logger.info("services", `Serviço ${service.id ? 'atualizado' : 'criado'} com sucesso`, {
        serviceId: serviceData.id
      });

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("services", "Erro ao salvar serviço", error);
        toast.error("Erro ao salvar serviço", {
          description: error.message || "Não foi possível salvar o serviço. Tente novamente."
        });
      }
      return false;
    }
  }, [mutation]);

  // Handler seguro para deleção
  const handleDelete = useCallback(async (serviceId: string) => {
    try {
      await deletion.handleDelete(serviceId);
      logger.info("services", "Serviço excluído com sucesso", {
        serviceId
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("services", "Erro ao excluir serviço", error);
        toast.error("Erro ao excluir serviço", {
          description: error.message || "Não foi possível excluir o serviço. Tente novamente."
        });
      }
      return false;
    }
  }, [deletion]);

  return {
    // Estado do diálogo
    isDialogOpen: mutation.isDialogOpen,
    setIsDialogOpen: mutation.setIsDialogOpen,
    showDeleteDialog: deletion.showDeleteDialog,
    setShowDeleteDialog: deletion.setShowDeleteDialog,

    // Estado do serviço selecionado
    selectedService: mutation.selectedService || deletion.selectedService,
    setSelectedService: (service: Service | null) => {
      mutation.setSelectedService(service);
      deletion.setSelectedService(service);
    },

    // Operações
    handleCreateOrUpdate,
    handleDelete,
    toggleStatus: status.toggleStatus,
  };
};
