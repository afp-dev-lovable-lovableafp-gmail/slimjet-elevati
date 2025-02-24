
import { Input } from "@/components/ui/input";

interface PhotoUploaderProps {
  onPhotoChange: (file: File) => void;
}

export const PhotoUploader = ({ onPhotoChange }: PhotoUploaderProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Foto</label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPhotoChange(file);
        }}
      />
    </div>
  );
};
