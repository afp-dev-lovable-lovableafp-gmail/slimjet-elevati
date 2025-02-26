
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { CustomField, CreateCustomFieldDTO } from "@/types/custom-field";
import type { Json } from "@/integrations/supabase/types";

// Helper function para converter o Json do Supabase para nosso tipo de opções
const parseOptions = (options: Json): { label: string; value: string }[] | undefined => {
  if (!Array.isArray(options)) return undefined;
  
  return options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        label: String((opt as Record<string, unknown>).label || ''),
        value: String((opt as Record<string, unknown>).value || '')
      };
    }
    return { label: '', value: '' };
  });
};

// Helper function para converter o objeto do Supabase para CustomField
const parseCustomField = (field: {
  id: string;
  name: string;
  entity_type: string;
  field_type: string;
  is_required: boolean;
  is_active: boolean;
  options: Json;
  created_at?: string;
  updated_at?: string;
}): CustomField => {
  return {
    ...field,
    field_type: field.field_type as CustomField['field_type'],
    options: parseOptions(field.options)
  };
};

export const useCustomFields = (entityType?: string) => {
  const queryClient = useQueryClient();

  const { data: fields, isLoading, error } = useQuery({
    queryKey: ['custom-fields', entityType],
    queryFn: async () => {
      const query = supabase
        .from('custom_fields')
        .select('*')
        .eq('is_active', true);

      if (entityType) {
        query.eq('entity_type', entityType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching custom fields:', error);
        throw error;
      }

      return data.map(parseCustomField);
    },
  });

  const createField = useMutation({
    mutationFn: async (data: CreateCustomFieldDTO) => {
      const { error } = await supabase
        .from('custom_fields')
        .insert({
          ...data,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success("Campo personalizado criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error creating custom field:', error);
      toast.error("Erro ao criar campo personalizado");
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CustomField> & { id: string }) => {
      const { error } = await supabase
        .from('custom_fields')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success("Campo personalizado atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error updating custom field:', error);
      toast.error("Erro ao atualizar campo personalizado");
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_fields')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success("Campo personalizado removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error deleting custom field:', error);
      toast.error("Erro ao remover campo personalizado");
    },
  });

  return {
    fields,
    isLoading,
    error,
    createField,
    updateField,
    deleteField,
  };
};
