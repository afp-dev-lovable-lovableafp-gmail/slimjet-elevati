
import { useServiceMutation } from "./services/useServiceMutation";
import { useServiceDeletion } from "./services/useServiceDeletion";
import { useServiceStatus } from "./services/useServiceStatus";
import type { Service } from "@/types/service";

export const useServiceOperations = (refetch: () => void) => {
  const mutation = useServiceMutation(refetch);
  const deletion = useServiceDeletion(refetch);
  const status = useServiceStatus(refetch);

  return {
    // Mutation operations
    isDialogOpen: mutation.isDialogOpen,
    setIsDialogOpen: mutation.setIsDialogOpen,
    handleCreateOrUpdate: mutation.handleCreateOrUpdate,

    // Deletion operations
    showDeleteDialog: deletion.showDeleteDialog,
    setShowDeleteDialog: deletion.setShowDeleteDialog,
    handleDelete: deletion.handleDelete,

    // Service selection (shared between mutation and deletion)
    selectedService: mutation.selectedService || deletion.selectedService,
    setSelectedService: (service: Service | null) => {
      mutation.setSelectedService(service);
      deletion.setSelectedService(service);
    },

    // Status operations
    toggleStatus: status.toggleStatus,
  };
};
