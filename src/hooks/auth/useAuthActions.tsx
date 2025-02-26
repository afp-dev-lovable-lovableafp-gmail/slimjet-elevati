
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { logger } from "@/utils/logger";

export const useAuthActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      logger.info("auth", "Login realizado com sucesso", {
        userId: data.user?.id
      });

      return data;
    } catch (error: any) {
      logger.error("auth", "Erro no login", error);
      toast("Erro no login", {
        description: error.message || "Verifique suas credenciais e tente novamente."
      });
      return null;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone
          }
        }
      });

      if (error) throw error;

      logger.info("auth", "Cadastro realizado com sucesso", {
        userId: data.user?.id
      });

      return data;
    } catch (error: any) {
      logger.error("auth", "Erro no cadastro", error);
      toast("Erro no cadastro", {
        description: error.message || "Não foi possível completar o cadastro. Tente novamente."
      });
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      await queryClient.clear();
      logger.info("auth", "Logout realizado com sucesso");
      
      navigate('/', { replace: true });
      toast("Logout realizado", {
        description: "Até logo!"
      });
    } catch (error: any) {
      logger.error("auth", "Erro no logout", error);
      toast("Erro ao fazer logout", {
        description: error.message || "Não foi possível fazer logout. Tente novamente."
      });
    }
  }, [queryClient, navigate]);

  return {
    signIn,
    signUp,
    signOut
  };
};
