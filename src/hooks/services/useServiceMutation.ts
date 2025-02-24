
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/types/service";

export const useServiceMutation = (refetch: () => void) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();

  const handleCreateOrUpdate = async (formData: Service) => {
    try {
      if (selectedService) {
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            display_order: formData.display_order
          })
          .eq('id', selectedService.id);

        if (error) throw error;
        toast({
          title: "Serviço atualizado",
          description: "O serviço foi atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            name: formData.name,
            description: formData.description,
            is_active: formData.is_active,
            display_order: formData.display_order
          });

        if (error) throw error;
        toast({
          title: "Serviço criado",
          description: "O serviço foi criado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      setSelectedService(null);
      refetch();
    } catch (error: any) {
      console.error('Erro ao salvar serviço:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar o serviço.",
      });
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedService,
    setSelectedService,
    handleCreateOrUpdate,
  };
};
