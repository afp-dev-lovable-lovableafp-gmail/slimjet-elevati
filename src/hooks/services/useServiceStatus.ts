
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
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
      console.error('Erro ao atualizar status:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do serviço.",
      });
    }
  };

  return {
    toggleStatus,
  };
};
