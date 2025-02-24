
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setProfile(data);
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
    status,
    error,
    refetch: fetchProfile
  };
};
