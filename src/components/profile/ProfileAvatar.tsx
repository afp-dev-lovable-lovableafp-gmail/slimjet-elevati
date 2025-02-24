
import { useState } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl?: string | null;
  fullName: string;
  onAvatarUpdate: (url: string) => void;
}

const ProfileAvatar = ({ userId, avatarUrl, fullName, onAvatarUpdate }: ProfileAvatarProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Você precisa selecionar uma imagem para upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      console.log("Iniciando upload do avatar:", {
        bucket: 'avatars',
        fileName: fileName,
        fileType: file.type,
        fileSize: file.size
      });

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        console.error("Erro no upload:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log("Upload concluído. URL pública:", publicUrl);

      onAvatarUpdate(publicUrl);

      toast({
        title: "Avatar atualizado com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro completo:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar avatar",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{fullName?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <label 
        htmlFor="avatar-upload" 
        className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <Camera className="h-4 w-4 text-white" />
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ProfileAvatar;
