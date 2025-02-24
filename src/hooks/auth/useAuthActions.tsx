
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";
import { signInWithEmail, signUpWithEmail, signOutUser } from "@/services/auth";

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('[Auth] Erro no login:', error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message,
      });
      return false;
    }
  }, [toast]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const { error } = await signUpWithEmail(email, password, fullName, phone || '');
      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('[Auth] Erro no cadastro:', error);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message,
      });
      return false;
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await signOutUser();
      if (error) throw error;

      await queryClient.clear();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['session'] }),
        queryClient.invalidateQueries({ queryKey: ['profile'] })
      ]);

      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
      
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('[Auth] Erro no logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message,
      });
    }
  }, [queryClient, toast, navigate]);

  return {
    signIn,
    signUp,
    signOut
  };
};
