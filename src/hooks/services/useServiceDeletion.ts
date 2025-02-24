
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/types/service";

export const useServiceDeletion = (refetch: () => void) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;

      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
      });

      setShowDeleteDialog(false);
      setSelectedService(null);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao excluir o serviço.",
      });
    }
  };

  return {
    showDeleteDialog,
    setShowDeleteDialog,
    selectedService,
    setSelectedService,
    handleDelete,
  };
};
