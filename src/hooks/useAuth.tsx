
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import type { Profile, Client, AuthContextType } from "@/types/auth";

// Criando o contexto de autenticação
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  client: null,
  loading: true,
  authenticated: false,
  error: null,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
});

// Provider para o contexto de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Função para buscar dados do perfil e cliente
  const fetchUserData = async (userId: string) => {
    try {
      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Erro ao buscar perfil:", profileError);
        throw profileError;
      }

      // Buscar cliente
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", userId)
        .single();

      if (clientError && clientError.code !== "PGRST116") {
        console.error("Erro ao buscar cliente:", clientError);
        throw clientError;
      }

      setProfile(profileData || null);
      setClient(clientData || null);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
    }
  };

  // Verificar sessão atual ao carregar o componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);

        // Verificar se há uma sessão ativa
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (sessionData.session?.user) {
          setUser(sessionData.session.user);
          setAuthenticated(true);
          await fetchUserData(sessionData.session.user.id);
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setAuthenticated(true);
          await fetchUserData(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setClient(null);
          setAuthenticated(false);
        }
      }
    );

    // Limpar listener ao desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verificar se o usuário existe como cliente
      if (data.user) {
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (clientError && clientError.code !== "PGRST116") {
          throw clientError;
        }

        // Se não existir cliente, redirecionar para o cadastro
        if (!clientData) {
          await supabase.auth.signOut();
          setUser(null);
          setAuthenticated(false);
          toast.error("Usuário não encontrado", {
            description: "Por favor, crie uma conta antes de fazer login.",
          });
          return {};
        }

        // Login bem-sucedido
        setUser(data.user);
        setAuthenticated(true);
        await fetchUserData(data.user.id);
        navigate("/client/dashboard"); // Atualizado para nova rota
        toast.success("Login realizado com sucesso!");
        return data;
      }
      
      return {};
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      
      if (err instanceof Error) {
        toast.error("Erro ao fazer login", {
          description: err.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : err.message,
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      setLoading(true);
      
      // 1. Criar o usuário na autenticação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            user_type: "client",
            is_admin: false,
          },
        },
      });

      if (error) throw error;
      
      if (data.user) {
        // 2. Verificar se o perfil foi criado pelo trigger
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Erro ao buscar perfil após cadastro:", profileError);
        }

        // Se não houver perfil, criar manualmente
        if (!profileData) {
          const { error: insertProfileError } = await supabase
            .from("profiles")
            .insert([{ 
              id: data.user.id,
              auth_id: data.user.id,
              is_admin: false,
              user_type: "client" 
            }]);

          if (insertProfileError) {
            console.error("Erro ao criar perfil:", insertProfileError);
          }
        }

        // 3. Criar o cliente
        const { error: clientError } = await supabase
          .from("clients")
          .insert([{
            id: data.user.id,
            full_name: fullName,
            phone,
            email,
          }]);

        if (clientError) {
          console.error("Erro ao criar cliente:", clientError);
          throw clientError;
        }

        toast.success("Conta criada com sucesso!", {
          description: "Você já pode fazer login.",
        });
        
        return data;
      }
      
      return {};
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      
      if (err instanceof Error) {
        toast.error("Erro ao criar conta", {
          description: err.message,
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setClient(null);
      setAuthenticated(false);
      
      navigate("/auth");
      toast.success("Logout realizado com sucesso!");
    } catch (err) {
      console.error("Erro no logout:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      toast.error("Erro ao fazer logout");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valores do contexto
  const value = {
    user,
    profile,
    client,
    loading,
    authenticated,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};
