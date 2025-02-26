
import { useMemo } from "react";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import type { AuthState } from "@/types/auth";

export const useAuthState = () => {
  const { session, status: sessionStatus } = useSession();
  const { 
    profile, 
    status: profileStatus, 
    error: profileError 
  } = useProfile(session?.user?.id);

  return useMemo<AuthState>(() => ({
    user: session?.user ?? null,
    profile: profile ?? null,
    loading: sessionStatus === 'pending' || profileStatus === 'loading',
    error: profileError,
    authenticated: !!session?.user,
    isAdmin: profile?.is_admin ?? false
  }), [session, profile, sessionStatus, profileStatus, profileError]);
};
