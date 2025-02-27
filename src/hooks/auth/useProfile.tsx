
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/utils/logger";
import type { Profile, Client } from "@/types/auth";

export type ProfileStatus = 'idle' | 'loading' | 'error' | 'success';

interface UseProfileResult {
  profile: Profile | null;
  client: Client | null;
  status: ProfileStatus;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProfile = (userId: string | undefined): UseProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setClient(null);
      setStatus('success');
      return;
    }

    try {
      setStatus('loading');

      // Primeiro tenta obter o perfil existente
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Também busca os dados do cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (clientError && clientError.code !== 'PGRST116') {
        throw clientError;
      }

      if (profileData) {
        // Converte os dados do banco para o tipo Profile
        const userProfile: Profile = {
          id: profileData.id,
          is_admin: profileData.is_admin || false,
          user_type: profileData.user_type || 'client',
          full_name: profileData.full_name || '',
          company_name: profileData.company_name || null,
          phone: profileData.phone || null,
          avatar_url: profileData.avatar_url || null,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
        
        setProfile(userProfile);
      } else {
        // Se não existir perfil, cria um novo
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            is_admin: false,
            user_type: 'client'
          }])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        if (newProfile) {
          // Converte os dados do novo perfil para o tipo Profile
          const userProfile: Profile = {
            id: newProfile.id,
            is_admin: newProfile.is_admin || false,
            user_type: newProfile.user_type || 'client',
            full_name: newProfile.full_name || '',
            company_name: newProfile.company_name || null,
            phone: newProfile.phone || null,
            avatar_url: newProfile.avatar_url || null,
            created_at: newProfile.created_at,
            updated_at: newProfile.updated_at
          };
          
          setProfile(userProfile);
        }
      }
      
      // Atualiza o cliente se existir
      if (clientData) {
        const userClient: Client = {
          id: clientData.id,
          full_name: clientData.full_name || '',
          company_name: clientData.company_name || null,
          phone: clientData.phone || null,
          avatar_url: clientData.avatar_url || null,
          email: clientData.email || null,
          created_at: clientData.created_at,
          updated_at: clientData.updated_at
        };
        
        setClient(userClient);
      }
      
      setStatus('success');
      setError(null);
    } catch (err) {
      const error = err as Error;
      logger.error("auth", "Error loading profile:", { error });
      setStatus('error');
      setError(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    client,
    status,
    error,
    refetch: fetchProfile
  };
};
