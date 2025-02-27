
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getInitials } from "@/utils/string";

export interface ProfileAvatarProps {
  avatarUrl?: string;
  onAvatarChange: (url: string | null) => void;
  userId: string;
}

const ProfileAvatar = ({ avatarUrl, onAvatarChange, userId }: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (file: File) => {
    if (!userId) {
      toast.error("ID de usuário não encontrado");
      return;
    }

    try {
      setIsUploading(true);

      // Verificar o tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Somente imagens são permitidas");
        return;
      }

      // Limitar o tamanho do arquivo (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("O arquivo deve ter menos de 2MB");
        return;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Fazer upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("user_avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data } = supabase.storage
        .from("user_avatars")
        .getPublicUrl(filePath);

      // Atualizar o avatar do usuário
      const { error: updateError } = await supabase
        .from("clients")
        .update({ avatar_url: data.publicUrl })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      onAvatarChange(data.publicUrl);
      toast.success("Avatar atualizado com sucesso");
    } catch (error: unknown) {
      console.error("Error updating avatar:", error);
      toast.error("Erro ao atualizar avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt="Avatar" />
        <AvatarFallback className="text-2xl">
          {getInitials(userId)}
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isUploading}
          onClick={() => document.getElementById("avatar-upload")?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Alterar foto
            </>
          )}
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          title="Selecionar foto de perfil"
          aria-label="Selecionar foto de perfil"
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
