
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useAuthSession = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['session'] }),
          queryClient.invalidateQueries({ queryKey: ['profile'] })
        ]);
        
        if (event === 'SIGNED_OUT') {
          navigate('/', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient, navigate]);

  return null;
};
