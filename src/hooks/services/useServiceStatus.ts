
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { handleError } from "@/utils/error-handler";
import type { Service } from "@/types/service";

export const useServiceStatus = (refetch: () => void) => {
  const { toast } = useToast();

  const toggleStatus = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !service.is_active })
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `O serviço foi ${service.is_active ? 'desativado' : 'ativado'} com sucesso.`,
      });

      refetch();
    } catch (error) {
      handleError(error, 'Erro ao atualizar status do serviço');
    }
  };

  return { toggleStatus };
};
