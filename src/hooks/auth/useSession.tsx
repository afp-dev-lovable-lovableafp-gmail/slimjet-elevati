
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type SessionStatus = 'pending' | 'authenticated' | 'unauthenticated';

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SessionStatus>('pending');

  useEffect(() => {
    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setStatus(initialSession ? 'authenticated' : 'unauthenticated');
      
      console.log("[Auth] Estado inicial:", {
        event: "INITIAL_SESSION",
        userId: initialSession?.user?.id,
        status: initialSession ? 'authenticated' : 'unauthenticated',
        timestamp: new Date().toISOString()
      });
    });

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setStatus(session ? 'authenticated' : 'unauthenticated');
      
      console.log("[Auth] Estado alterado:", {
        event: _event,
        userId: session?.user?.id,
        status: session ? 'authenticated' : 'unauthenticated',
        timestamp: new Date().toISOString()
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, status };
};
