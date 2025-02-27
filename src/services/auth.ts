
import { supabase } from "@/lib/supabase";
import type { Profile, Client } from "@/types/auth";

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  if (!userId) {
    console.error("UserId não fornecido para fetchUserProfile");
    return null;
  }

  try {
    // Buscar o perfil base
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      throw profileError;
    }

    // Buscar dados do cliente associado
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", userId)
      .single();

    if (clientError && clientError.code !== 'PGRST116') { // Ignora erro de não encontrado
      console.error("Erro ao buscar dados do cliente:", clientError);
      throw clientError;
    }

    // Verificar se é admin
    const { data: isAdmin } = await supabase.rpc('check_if_admin', {
      user_id: userId
    });

    // Combinar os dados
    const enhancedProfile: Profile = {
      ...profileData,
      is_admin: isAdmin,
    };

    return enhancedProfile;
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Erro no signInWithEmail:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  fullName: string, 
  phone: string
) => {
  try {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    });

    if (response.error) {
      throw response.error;
    }

    // Aguardar um momento para garantir que o trigger tenha tempo de executar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Fazer logout imediatamente após o registro para garantir que o usuário não fique autenticado
    await supabase.auth.signOut();

    return response;
  } catch (error) {
    console.error("Erro no signUpWithEmail:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error("Erro no signOut:", error);
    throw error;
  }
};
