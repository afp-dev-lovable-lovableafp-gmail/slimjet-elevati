
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthState } from './useAuthState';

export const useAuthSession = () => {
  const { setUser, setLoading } = useAuthState();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
};
