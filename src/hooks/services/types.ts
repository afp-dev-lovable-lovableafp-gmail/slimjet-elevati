
import type { Service } from "@/types/service";

export interface ServiceMutationState {
  isDialogOpen: boolean;
  selectedService: Service | null;
}

export interface ServiceDeletionState {
  showDeleteDialog: boolean;
  selectedService: Service | null;
}

export interface ServiceMutationActions {
  setIsDialogOpen: (open: boolean) => void;
  setSelectedService: (service: Service | null) => void;
  handleCreateOrUpdate: (service: Service) => Promise<void>;
}

export interface ServiceDeletionActions {
  setShowDeleteDialog: (open: boolean) => void;
  setSelectedService: (service: Service | null) => void;
  handleDelete: () => Promise<void>;
}

export interface ServiceOperations {
  // Mutation state and actions
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  handleCreateOrUpdate: (service: Service) => Promise<void>;
  
  // Deletion state and actions
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  handleDelete: () => Promise<void>;
  
  // Status actions
  toggleStatus: (service: Service) => Promise<void>;
}
