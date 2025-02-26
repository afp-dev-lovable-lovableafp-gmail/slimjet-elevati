
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

      // First try to get the existing profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile exists, check admin status
      if (profileData) {
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('check_if_admin', { user_id: userId });
        
        if (adminError) {
          logger.warn("auth", "Error checking admin status", { 
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
        // If no profile exists, create one
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            is_admin: false
          }])
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
    status,
    error,
    refetch: fetchProfile
  };
};
