import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { logger } from "@/features/logging/logger";
import { toAppError } from "@/types/extended-error";

export const useAuthActions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }

      logger.info("auth", "Iniciando login", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      logger.info("auth", "Login bem-sucedido", {
        userId: data.user?.id
      });

      navigate("/client/dashboard"); // Atualizado para a nova rota
      return data;
    } catch (error: unknown) {
      const appError = toAppError(error, { email });
      logger.error("auth", "Erro no login", appError);
      
      if (error instanceof Error && error.message) {
        toast.error("Erro ao fazer login", {
          description: error.message
        });
      } else {
        toast.error("Erro ao fazer login", {
          description: "Verifique suas credenciais e tente novamente."
        });
      }
      
      throw error;
    }
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      if (!email || !password || !fullName) {
        throw new Error("Email, senha e nome completo são obrigatórios");
      }

      // 1. Criar o usuário na autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Erro ao criar usuário");
      }

      logger.info("auth", "Usuário criado com sucesso na autenticação", {
        userId: authData.user.id
      });

      // O trigger do Supabase já deve criar o registro na tabela profiles
      // Mas vamos garantir que o cliente seja criado
      const { error: clientError } = await supabase
        .from('clients')
        .insert([
          {
            id: authData.user.id,
            full_name: fullName,
            email,
            phone
          }
        ]);

      if (clientError) {
        const appError = toAppError(clientError, { userId: authData.user.id });
        logger.error("auth", "Erro ao criar cliente", appError);
        
        // Não vamos interromper o fluxo se falhar, já que o usuário foi criado
        toast.warning("Aviso: Seus dados de perfil podem estar incompletos", {
          description: "Você pode atualizá-los mais tarde em seu perfil."
        });
      }

      logger.info("auth", "Cadastro completo realizado com sucesso", {
        userId: authData.user.id
      });

      toast.success("Cadastro realizado com sucesso!", {
        description: "Você já pode fazer login."
      });

      return authData;
    } catch (error: unknown) {
      const appError = toAppError(error, { email });
      logger.error("auth", "Erro no cadastro", appError);
      
      toast.error("Erro no cadastro", {
        description: error instanceof Error ? error.message : "Não foi possível completar o cadastro. Tente novamente."
      });
      
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Primeiro removemos todos os dados locais
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();

      // Removemos os cookies do Supabase
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Fazemos o logout no Supabase
      await supabase.auth.signOut();

      // Redirecionamos para a página de autenticação
      window.location.href = '/auth/login';
    } catch (error: unknown) {
      logger.error("auth", "Erro ao fazer logout", toAppError(error));
      
      // Em caso de erro, forçamos a limpeza e redirecionamento
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();
      window.location.href = '/auth/login';
    }
  }, [queryClient]);

  return {
    signIn,
    signUp,
    signOut
  };
};
