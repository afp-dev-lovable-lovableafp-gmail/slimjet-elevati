
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Tag } from '@/types/tag';

export const useTags = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: tags, isLoading, error, refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Tag[];
    },
  });

  const toggleStatus = async (tag: Tag) => {
    try {
      const newStatus = tag.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('tags')
        .update({ status: newStatus })
        .eq('id', tag.id);

      if (error) throw error;
      
      toast({
        title: "Status atualizado",
        description: `Status da tag "${tag.name}" atualizado com sucesso.`,
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar status: " + error.message,
      });
    }
  };

  const deleteTag = async () => {
    if (!selectedTag) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', selectedTag.id);

      if (error) throw error;

      toast({
        title: "Tag excluída",
        description: `A tag "${selectedTag.name}" foi excluída com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedTag(null);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir tag: " + error.message,
      });
    }
  };

  return {
    tags: tags || [],
    isLoading,
    error,
    selectedTag,
    setSelectedTag,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    toggleStatus,
    deleteTag,
    refetch
  };
};
