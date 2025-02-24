
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import ProfileFormFields from "./ProfileFormFields";

interface FormProfile {
  full_name: string;
  company_name: string | null;
  phone: string;
  avatar_url: string | null;
}

const ProfileForm = () => {
  const [profile, setProfile] = useState<FormProfile>({
    full_name: "",
    company_name: "",
    phone: "",
    avatar_url: null
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Primeiro tenta carregar da tabela clients
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('auth_id', user?.id)
        .single();

      if (!clientError && clientData) {
        setProfile({
          full_name: clientData.full_name || "",
          company_name: clientData.company_name || "",
          phone: clientData.phone || "",
          avatar_url: clientData.avatar_url
        });
      } else {
        // Se não encontrar como cliente, tenta carregar da tabela profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (!profileError && profileData) {
          setProfile({
            full_name: profileData.full_name || "",
            company_name: profileData.company_name || "",
            phone: profileData.phone || "",
            avatar_url: profileData.avatar_url
          });
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limitedNumbers = numbers.slice(0, 11);
    let formatted = "";

    if (limitedNumbers.length <= 2) {
      formatted = limitedNumbers.length === 0 ? "" : `(${limitedNumbers}`;
    } else {
      formatted = `(${limitedNumbers.slice(0, 2)})`;
      if (limitedNumbers.length > 2) {
        formatted += limitedNumbers.slice(2, 7);
      }
      if (limitedNumbers.length > 7) {
        formatted += `-${limitedNumbers.slice(7)}`;
      }
    }

    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Primeiro tenta atualizar na tabela clients
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          full_name: profile.full_name,
          company_name: profile.company_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_id', user?.id);

      if (clientError) {
        // Se não encontrar como cliente, tenta atualizar na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.full_name,
            company_name: profile.company_name,
            phone: profile.phone,
            avatar_url: profile.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user?.id);

        if (profileError) throw profileError;
      }

      toast({
        title: "Perfil atualizado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center space-y-4">
          <ProfileAvatar
            userId={user?.id || ""}
            avatarUrl={profile.avatar_url}
            fullName={profile.full_name}
            onAvatarUpdate={(url) => setProfile({ ...profile, avatar_url: url })}
          />
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            Mantenha seus dados atualizados
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProfileFormFields
            profile={profile}
            onProfileChange={(newProfile: FormProfile) => setProfile(newProfile)}
            formatPhone={formatPhone}
          />
          <Button type="submit" className="w-full">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
