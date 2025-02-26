
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { FormProfile } from "@/types/profile";

export const useProfileForm = () => {
  const [profile, setProfile] = useState<FormProfile>({
    full_name: "",
    company_name: "",
    phone: "",
    avatar_url: null,
    userId: ""
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
      setLoading(true);
      if (!user?.id) return;

      // Primeiro tenta carregar da tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          company_name: profileData.company_name || "",
          phone: profileData.phone || "",
          avatar_url: profileData.avatar_url,
          userId: user.id
        });
      } else if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 é o código para "nenhum registro encontrado"
        console.error("Erro ao carregar perfil:", profileError);
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: profileError.message
        });
      }

      // Se não encontrou na tabela profiles, tenta criar um perfil básico
      if (!profileData) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || "",
            phone: user.user_metadata?.phone || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error("Erro ao criar perfil:", insertError);
          toast({
            variant: "destructive",
            title: "Erro ao criar perfil",
            description: insertError.message
          });
        } else {
          // Carrega o perfil recém-criado
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (newProfile) {
            setProfile({
              full_name: newProfile.full_name || "",
              company_name: newProfile.company_name || "",
              phone: newProfile.phone || "",
              avatar_url: newProfile.avatar_url,
              userId: user.id
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Erro ao processar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao processar perfil",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user?.id) {
        throw new Error("Usuário não identificado");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          company_name: profile.company_name,
          phone: profile.phone,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado com sucesso!",
      });

      // Atualiza os metadados do usuário
      await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone
        }
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
    }
  };

  const handleProfileChange = (newProfile: FormProfile) => {
    setProfile(newProfile);
  };

  return {
    profile,
    loading,
    handleSubmit,
    handleProfileChange
  };
};
