
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { logger } from "@/features/logging/logger";

type SessionStatus = 'pending' | 'authenticated' | 'unauthenticated';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>('pending');

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setStatus(initialSession ? 'authenticated' : 'unauthenticated');
      
      logger.info("auth", "Estado inicial da sessão:", {
        event: "INITIAL_SESSION",
        userId: initialSession?.user?.id,
        status: initialSession ? 'authenticated' : 'unauthenticated'
      });
    });

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setStatus(session ? 'authenticated' : 'unauthenticated');
      
      logger.info("auth", "Estado da sessão alterado:", {
        event: _event,
        userId: session?.user?.id,
        status: session ? 'authenticated' : 'unauthenticated'
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, status };
};
