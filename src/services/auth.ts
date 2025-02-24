
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/auth";
import type { AuthError } from "@supabase/supabase-js";

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  if (!userId) {
    console.error("UserId não fornecido para fetchUserProfile");
    return null;
  }

  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      throw profileError;
    }

    if (!profileData) {
      console.log("Nenhum perfil encontrado para o userId:", userId);
      return null;
    }

    // Verificar se é admin
    const { data: isAdmin } = await supabase.rpc('check_if_admin', {
      user_id: userId
    });

    return {
      ...profileData,
      is_admin: isAdmin
    } as Profile;
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
