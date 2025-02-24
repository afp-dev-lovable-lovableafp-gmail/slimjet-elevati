
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";

export const useServiceForm = (
  service?: Service | null,
  onClose?: () => void,
  onSuccess?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(service?.is_active ?? true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Service>({
    defaultValues: service || {
      name: "",
      description: "",
      duration: 60,
      price: 0,
      display_order: 0,
      is_active: true,
    },
  });

  const handleSave = useCallback(async (data: Service) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .upsert({
          id: service?.id,
          ...data,
          is_active: isActive,
        }, { onConflict: 'id' });

      if (error) throw error;

      if (service?.id) {
        const { error: deleteError } = await supabase
          .from('service_tags')
          .delete()
          .eq('service_id', service.id);

        if (deleteError) throw deleteError;
      }

      const serviceTagsToInsert = selectedTags.map((tagId) => ({
        service_id: service?.id || data.id,
        tag_id: tagId,
      }));

      if (serviceTagsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('service_tags')
          .insert(serviceTagsToInsert);

        if (insertError) throw insertError;
      }

      toast(`Serviço ${service ? 'atualizado' : 'criado'} com sucesso.`);
      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error("Erro ao salvar serviço:", error);
      toast("Ocorreu um erro ao salvar o serviço.");
    } finally {
      setIsLoading(false);
    }
  }, [service, isActive, selectedTags, onSuccess, onClose]);

  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  return {
    isLoading,
    isActive,
    setIsActive,
    selectedTags,
    toggleTag,
    register,
    errors,
    handleSubmit: handleSubmit(handleSave)
  };
};
