import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getInitials } from "@/utils/string";

interface ProfileAvatarProps {
  avatarUrl?: string;
  onAvatarChange: (url: string | null) => void;
  userId: string;
  name?: string;
}

const ProfileAvatar = ({ avatarUrl, onAvatarChange, userId, name }: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo é muito grande", {
        description: "O tamanho máximo permitido é 2MB"
      });
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onAvatarChange(publicUrl);
      toast.success("Avatar atualizado com sucesso");
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("Erro ao atualizar avatar", {
        description: message
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl} alt={name || "Avatar do usuário"} />
        <AvatarFallback>{getInitials(name || "Usuário")}</AvatarFallback>
      </Avatar>
      <div>
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Alterar foto
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            accept="image/*"
            title="Selecionar foto de perfil"
            aria-label="Selecionar foto de perfil"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </Button>
        <p className="text-sm text-muted-foreground mt-1">
          JPG, GIF ou PNG. Máximo 2MB.
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar; 