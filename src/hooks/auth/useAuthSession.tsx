import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from "@/utils/logger";
import type { AuthState } from '@/types/auth';

type SetAuthState = (newState: Partial<AuthState> | ((prev: AuthState) => AuthState)) => void;

export const useAuthSession = (setAuthState: SetAuthState) => {
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      logger.info("auth", "Auth state changed", {
        event: _event,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false
      }));
    });

    return () => subscription.unsubscribe();
  }, [setAuthState]);
};
