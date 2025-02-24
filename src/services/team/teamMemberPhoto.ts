
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const uploadTeamMemberPhoto = async (photoFile: File): Promise<string | null> => {
  try {
    const fileExt = photoFile.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('team-photos')
      .upload(filePath, photoFile);

    if (uploadError) {
      console.error("Erro ao fazer upload da foto:", uploadError);
      toast.error("Erro ao fazer upload da foto. Por favor, tente novamente.");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('team-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Erro no upload da foto:", error);
    return null;
  }
};
