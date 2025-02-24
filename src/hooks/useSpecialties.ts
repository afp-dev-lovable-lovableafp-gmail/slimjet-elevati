
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const useSpecialties = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: specialties, isLoading, error, refetch } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Specialty[];
    },
  });

  const toggleStatus = async (specialty: Specialty) => {
    try {
      const newStatus = specialty.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('specialties')
        .update({ status: newStatus })
        .eq('id', specialty.id);

      if (error) throw error;
      
      toast.success(`Status da especialidade "${specialty.name}" atualizado com sucesso!`);
      refetch();
    } catch (error: any) {
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  };

  const deleteSpecialty = async () => {
    if (!selectedSpecialty) return;

    try {
      // Primeiro verifica se existem membros vinculados
      const { data: linkedMembers, error: checkError } = await supabase
        .from('team_member_specialties')
        .select('team_member_id')
        .eq('specialty_id', selectedSpecialty.id);

      if (checkError) throw checkError;

      if (linkedMembers && linkedMembers.length > 0) {
        toast.error('Não é possível excluir uma especialidade que está vinculada a membros da equipe.');
        return;
      }

      const { error } = await supabase
        .from('specialties')
        .delete()
        .eq('id', selectedSpecialty.id);

      if (error) throw error;

      toast.success(`Especialidade "${selectedSpecialty.name}" excluída com sucesso!`);
      setIsDeleteDialogOpen(false);
      setSelectedSpecialty(null);
      refetch();
    } catch (error: any) {
      toast.error('Erro ao excluir especialidade: ' + error.message);
    }
  };

  return {
    specialties: specialties || [],
    isLoading,
    error,
    selectedSpecialty,
    setSelectedSpecialty,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    toggleStatus,
    deleteSpecialty,
    refetch
  };
};
