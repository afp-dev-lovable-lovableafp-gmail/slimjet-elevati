
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { supabase } from "@/lib/supabase";
import type { TeamMember, TeamMemberFormData } from "@/types/team";

export const useTeamMemberForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = useCallback(async (data: TeamMemberFormData, photoFile?: File) => {
    setIsLoading(true);
    try {
      let photoUrl = data.photo_url;

      // Upload photo if provided
      if (photoFile) {
        const fileName = `${Date.now()}-${photoFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(uploadData.path);

        photoUrl = publicUrl;
      }

      // Create or update team member
      const { error } = await supabase
        .from('team_members')
        .upsert({
          ...data,
          photo_url: photoUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['team-members'] });
      
      toast({
        title: "Sucesso!",
        description: `Membro do time ${data.id ? 'atualizado' : 'criado'} com sucesso!`
      });

      return true;
    } catch (error: any) {
      console.error('[TeamMemberForm] Erro:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, toast]);

  const handleDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['team-members'] });
      
      toast({
        title: "Sucesso!",
        description: "Membro do time removido com sucesso!"
      });

      return true;
    } catch (error: any) {
      console.error('[TeamMemberForm] Erro ao deletar:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, toast]);

  return {
    isLoading,
    handleSubmit,
    handleDelete
  };
};
