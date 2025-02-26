
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profileData) {
        // Query admin status directly from profile data
        setProfile(profileData);
        setStatus('success');
        setError(null);
      } else {
        // If no profile exists, create one
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
          setProfile(newProfile);
          setStatus('success');
          setError(null);
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
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
