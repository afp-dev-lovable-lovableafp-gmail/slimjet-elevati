
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "../use-toast";

export const useTeamMemberPhoto = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('team-photos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error('[TeamMemberPhoto] Erro no upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  return {
    isUploading,
    uploadPhoto
  };
};
