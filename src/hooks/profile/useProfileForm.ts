
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Client } from "@/types/auth";
import type { FormProfile } from "@/types/profile";

export const useProfileForm = () => {
  const { user, client: authClient } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<FormProfile>({
    id: "",
    full_name: "",
    company_name: null,
    phone: "",
    avatar_url: null,
    email: null
  });

  useEffect(() => {
    if (user?.id) {
      if (authClient) {
        setProfile(authClient);
      } else {
        fetchClient(user.id);
      }
    }
  }, [user?.id, authClient]);

  const fetchClient = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data as FormProfile);
      }
    } catch (error: any) {
      console.error("Error fetching client:", error);
      toast.error("Erro ao carregar perfil", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: FormProfile) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("clients")
        .update({
          full_name: updatedProfile.full_name,
          company_name: updatedProfile.company_name,
          phone: updatedProfile.phone,
          avatar_url: updatedProfile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", updatedProfile.id);

      if (error) throw error;

      setProfile(updatedProfile);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile, // Mantendo compatibilidade com código existente
    isLoading,
    updateProfile
  };
};
