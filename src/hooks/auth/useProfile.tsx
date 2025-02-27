
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
      
      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      // Buscar cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (clientError && clientError.code !== "PGRST116") {
        throw clientError;
      }

      setProfile(profileData);
      setClient(clientData || null);
      setStatus('success');
      setError(null);
    } catch (err) {
      console.error('[Auth] Erro ao carregar perfil:', err);
      setStatus('error');
      setError(err as Error);
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
