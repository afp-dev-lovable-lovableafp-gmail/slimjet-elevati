
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Client } from "@/types/auth";

export const useProfileForm = () => {
  const { user, client: authClient } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<Client>({
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
        setClient(authClient);
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
        setClient(data as Client);
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

  const updateProfile = async (updatedClient: Client) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("clients")
        .update({
          full_name: updatedClient.full_name,
          company_name: updatedClient.company_name,
          phone: updatedClient.phone,
          avatar_url: updatedClient.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq("id", updatedClient.id);

      if (error) throw error;

      setClient(updatedClient);
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
    profile: client, // Mantendo compatibilidade com código existente
    isLoading,
    updateProfile
  };
};
