import { createContext, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useProfile } from '@/hooks/auth/useProfile';
import { useAuthSession } from '@/hooks/auth/useAuthSession';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useNavigate } from 'react-router-dom';
import { OAuthLoginParams, Client } from '@/types/auth';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  client: Client | null;
  loading: boolean;
  authenticated: boolean;
  error?: Error | null;
  setAuthState: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithOAuth: (params: OAuthLoginParams) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Criar o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider que fornece o contexto de autenticação para os componentes filhos
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { authState, setAuthState } = useAuthState();
  const { user, profile, loading, authenticated, client } = authState;
  const { profile: fetchedProfile, status: profileStatus } = useProfile(user?.id);
  
  // Inicializar a sessão do usuário
  useAuthSession(setAuthState);

  useEffect(() => {
    // Atualizar o estado do profile quando ele for carregado
    if (!loading && user && fetchedProfile && profileStatus === 'success') {
      // Criar um objeto client baseado no profile para manter compatibilidade
      const clientData: Client = {
        id: fetchedProfile.id,
        full_name: fetchedProfile.full_name,
        company_name: fetchedProfile.company_name,
        phone: fetchedProfile.phone,
        avatar_url: fetchedProfile.avatar_url,
        email: user.email,
        created_at: fetchedProfile.created_at,
        updated_at: fetchedProfile.updated_at
      };
      
      setAuthState({ 
        profile: fetchedProfile,
        client: clientData
      });
    }
  }, [fetchedProfile, profileStatus, user, loading]);

  // Login com email e senha
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      logger.info("auth", "Login realizado com sucesso", { userId: data.user?.id });
      
      toast.success('Login realizado com sucesso', {
        description: 'Você está sendo redirecionado...'
      });
    } catch (error: any) {
      logger.error("auth", "Erro durante login", { error });
      
      let errorMessage = 'Ocorreu um erro durante o login';
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        }
      }
      
      setAuthState({ error });
      
      toast.error('Erro ao fazer login', {
        description: errorMessage
      });

      throw error;
    }
  };

  // Cadastro com email e senha
  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      // Registrar o usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      // Criar o perfil do usuário com os dados adicionais
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          user_type: 'client',
          is_admin: false
        });

        logger.info("auth", "Cadastro realizado com sucesso", { userId: data.user.id });

        toast.success('Cadastro realizado com sucesso', {
          description: 'Verifique seu email para confirmar sua conta.'
        });
      }
    } catch (error: any) {
      logger.error("auth", "Erro durante cadastro", { error });
      
      let errorMessage = 'Ocorreu um erro durante o cadastro';
      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage = 'Este email já está registrado.';
        }
      }
      
      setAuthState({ error });
      
      toast.error('Erro ao criar conta', {
        description: errorMessage
      });

      throw error;
    }
  };

  // Login com provedor OAuth
  const signInWithOAuth = async ({ provider, redirectTo }: OAuthLoginParams) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo
        }
      });

      if (error) throw error;
    } catch (error: any) {
      logger.error("auth", "Erro durante login com OAuth", { error, provider });
      
      setAuthState({ error });
      
      toast.error('Erro ao fazer login', {
        description: 'Ocorreu um erro ao tentar fazer login com provedor externo.'
      });

      throw error;
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      logger.info("auth", "Logout realizado com sucesso");
      
      toast.success('Logout realizado com sucesso');
    } catch (error: any) {
      logger.error("auth", "Erro durante logout", { error });
      
      setAuthState({ error });
      
      toast.error('Erro ao fazer logout', {
        description: 'Ocorreu um erro ao tentar sair da sua conta.'
      });

      throw error;
    }
  };

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      logger.info("auth", "Email de recuperação enviado com sucesso");
      
      toast.success('Email enviado com sucesso', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.'
      });
    } catch (error: any) {
      logger.error("auth", "Erro ao enviar email de recuperação", { error });
      
      setAuthState({ error });
      
      toast.error('Erro ao enviar email', {
        description: 'Ocorreu um erro ao tentar enviar o email de recuperação.'
      });

      throw error;
    }
  };

  // Objeto com os valores que serão fornecidos pelo contexto
  const value = {
    user,
    profile,
    client,
    loading,
    authenticated,
    error: authState.error,
    setAuthState,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para facilitar o acesso ao contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
