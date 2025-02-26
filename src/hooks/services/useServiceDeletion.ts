
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { handleError } from "@/utils/error-handler";
import { toast } from "sonner";
import type { Service } from "@/types/service";

export const useServiceDeletion = (refetch: () => void) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleDelete = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast.success("Serviço excluído com sucesso");
      setShowDeleteDialog(false);
      setSelectedService(null);
      refetch();
    } catch (error) {
      handleError(error, "Erro ao excluir serviço");
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    selectedService,
    setSelectedService,
    handleDelete
  };
};
