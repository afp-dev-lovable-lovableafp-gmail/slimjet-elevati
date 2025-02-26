
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { DocumentTemplate, CreateDocumentTemplateDTO } from "@/types/document-template";
import type { Json } from "@/integrations/supabase/types";

// Helper function para converter o Json do Supabase para nosso tipo de variáveis
const parseVariables = (variables: Json): { name: string; type: string; description?: string }[] | undefined => {
  if (!Array.isArray(variables)) return undefined;
  
  return variables.map(variable => {
    if (typeof variable === 'object' && variable !== null) {
      const v = variable as Record<string, unknown>;
      return {
        name: String(v.name || ''),
        type: String(v.type || ''),
        description: v.description ? String(v.description) : undefined
      };
    }
    return { name: '', type: '' };
  });
};

// Helper function para converter o objeto do Supabase para DocumentTemplate
const parseDocumentTemplate = (template: {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables: Json;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}): DocumentTemplate => {
  return {
    ...template,
    variables: parseVariables(template.variables)
  };
};

export const useDocumentTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['document-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching document templates:', error);
        throw error;
      }

      return data.map(parseDocumentTemplate);
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (data: CreateDocumentTemplateDTO) => {
      const { error } = await supabase
        .from('document_templates')
        .insert({
          ...data,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast.success("Template criado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error creating document template:', error);
      toast.error("Erro ao criar template");
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...data }: Partial<DocumentTemplate> & { id: string }) => {
      const { error } = await supabase
        .from('document_templates')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error updating document template:', error);
      toast.error("Erro ao atualizar template");
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-templates'] });
      toast.success("Template removido com sucesso!");
    },
    onError: (error: Error) => {
      console.error('Error deleting document template:', error);
      toast.error("Erro ao remover template");
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
