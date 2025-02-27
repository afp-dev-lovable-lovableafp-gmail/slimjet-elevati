
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useProfileForm } from "@/hooks/profile/useProfileForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileFormFields from "@/components/profile/ProfileFormFields";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import { useAuth } from "@/hooks/useAuth";
import type { FormProfile } from "@/types/profile";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEditModal = ({ isOpen, onClose }: ProfileEditModalProps) => {
  const { profile, isLoading, updateProfile } = useProfileForm();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormProfile>({
    id: "",
    full_name: "",
    company_name: null,
    phone: "",
    avatar_url: null
  });
  const { user } = useAuth();

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name?.trim()) {
      toast.error("O nome completo é obrigatório");
      return;
    }
    
    if (!formData.phone?.trim()) {
      toast.error("O telefone é obrigatório");
      return;
    }
    
    updateProfile(formData).then(() => {
      onClose();
    });
  };

  const handleResetPassword = () => {
    setPasswordModalOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações pessoais
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <ProfileAvatar 
              avatarUrl={formData.avatar_url || undefined} 
              onAvatarChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              userId={formData.id}
            />
            
            <ProfileFormFields 
              profile={formData as any}
              onProfileChange={(updatedProfile) => setFormData(prev => ({ ...prev, ...updatedProfile }))}
            />
            
            <div className="pt-4 border-t space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Para alterar seu email, entre em contato com o suporte
              </p>
            </div>
            
            <DialogFooter className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
              >
                Alterar Senha
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ChangePasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </>
  );
};

export default ProfileEditModal;
