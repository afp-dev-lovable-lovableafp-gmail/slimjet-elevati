
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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
      
      // Primeiro, buscar dados básicos usando a função otimizada
      const { data: adminData, error: adminError } = await supabase
        .rpc('get_profile_by_id', { profile_id: userId });

      if (adminError) throw adminError;

      // Se encontrou dados básicos, buscar o perfil completo
      if (adminData && adminData.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) throw profileError;

        setProfile(profileData);
        setStatus('success');
        setError(null);
      } else {
        setProfile(null);
        setStatus('success');
      }
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
    status,
    error,
    refetch: fetchProfile
  };
};
