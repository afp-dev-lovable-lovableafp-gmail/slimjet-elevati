
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { logger } from "@/features/logging/logger";
import type { Profile } from "@/types/auth";

export type ProfileStatus = 'idle' | 'loading' | 'error' | 'success';

interface UseProfileResult {
  profile: Profile | null;
  status: ProfileStatus;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProfile = (userId: string | undefined): UseProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<ProfileStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    if (!userId) {
      setProfile(null);
      setStatus('success');
      return;
    }

    try {
      setStatus('loading');
      
      // Usar a função RPC otimizada para verificar se é admin primeiro
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('check_if_admin', { user_id: userId });

      if (adminError) throw adminError;

      // Buscar o perfil completo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          ...profileData,
          is_admin: isAdmin
        });
        setStatus('success');
        setError(null);
      } else {
        setProfile(null);
        setStatus('success');
      }
    } catch (err) {
      const error = err as Error;
      logger.error('auth', 'Erro ao carregar perfil:', { error });
      setStatus('error');
      setError(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    status,
    error,
    refetch: fetchProfile
  };
};
