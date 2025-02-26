
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (profileData) {
        // After getting profile, check admin status
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('check_if_admin', { user_id: userId });
        
        if (adminError) {
          logger.warn("auth", "Erro ao verificar status de admin", { 
            error: adminError,
            userId 
          });
        }

        setProfile({
          ...profileData,
          is_admin: isAdmin || false
        });
        setStatus('success');
        setError(null);
      } else {
        // If no profile exists yet, create one
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId }])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        if (newProfile) {
          setProfile({
            ...newProfile,
            is_admin: false
          });
          setStatus('success');
          setError(null);
        }
      }
    } catch (err) {
      const error = err as Error;
      logger.error("auth", "Erro ao carregar perfil:", { error });
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
