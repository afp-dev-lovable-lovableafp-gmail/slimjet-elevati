import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ChangePasswordModal from './ChangePasswordModal';
import ProfileAvatar from './ProfileAvatar';
import ProfileFormFields from './ProfileFormFields';
import { toast } from 'sonner';
import type { FormProfile } from '@/types/profile';
import type { Client } from '@/types/auth';

interface ProfileFormProps {
  initialData: FormProfile;
  onSubmit: (profile: FormProfile) => void;
  isLoading: boolean;
}

const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormProfile>(initialData);
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
    
    onSubmit(formData);
  };

  const handleResetPassword = async () => {
    setPasswordModalOpen(true);
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e configure sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileAvatar 
              avatarUrl={formData.avatar_url || undefined} 
              onAvatarChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
              userId={formData.id}
              name={formData.full_name}
            />
            
            <ProfileFormFields 
              profile={formData as Client}
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
            
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
              >
                Alterar Senha
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <ChangePasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </>
  );
};

export default ProfileForm; 