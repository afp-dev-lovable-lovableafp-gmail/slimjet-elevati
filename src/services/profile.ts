
import { supabase } from "@/lib/supabase";
import { logger } from "@/features/logging/logger";
import { toAppError } from "@/types/extended-error";
import type { Profile } from "@/types/auth";

export const fetchProfileData = async (userId: string) => {
  try {
    // Buscando o perfil básico
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      const appError = toAppError(profileError, {
        userId,
        timestamp: new Date().toISOString()
      });
      
      logger.error("profile", "Erro ao buscar perfil", appError);
      throw profileError;
    }

    return profileData as Profile;
  } catch (error) {
    const appError = toAppError(error, {
      userId,
      timestamp: new Date().toISOString()
    });
    
    logger.error("profile", "Erro ao buscar perfil", appError);
    throw error;
  }
};

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    logger.info("profile", "Verificando status de admin", { 
      userId, 
      timestamp: new Date().toISOString() 
    });
    
    const { data, error: fnError } = await supabase.rpc('check_if_admin', { 
      user_id: userId 
    });
    
    if (fnError) {
      const appError = toAppError(fnError, {
        userId,
        timestamp: new Date().toISOString()
      });
      
      logger.error("profile", "Erro ao verificar status de admin via RPC", appError);
      return checkAdminFallback(userId);
    }
    
    logger.info("profile", "Resultado da verificação de admin", { 
      isAdmin: !!data, 
      userId,
      timestamp: new Date().toISOString()
    });
    
    return !!data;
  } catch (err) {
    const appError = toAppError(err, { 
      userId,
      timestamp: new Date().toISOString()
    });
    
    logger.error("profile", "Erro ao verificar status de admin", appError);
    
    return checkAdminFallback(userId);
  }
};

const checkAdminFallback = async (userId: string): Promise<boolean> => {
  try {
    logger.info("profile", "Tentando verificar admin diretamente na tabela profiles", { 
      userId,
      timestamp: new Date().toISOString()
    });
    
    const { data, error: queryError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();
      
    if (queryError) {
      const appError = toAppError(queryError, {
        userId,
        timestamp: new Date().toISOString()
      });
      
      logger.error("profile", "Erro ao verificar admin na tabela", appError);
      return false;
    }
    
    logger.info("profile", "Resultado da verificação na tabela profiles", { 
      isAdmin: !!data?.is_admin, 
      userId,
      timestamp: new Date().toISOString()
    });
    
    return !!data?.is_admin;
  } catch (fallbackError) {
    const appError = toAppError(fallbackError, {
      userId,
      timestamp: new Date().toISOString()
    });
    
    logger.error("profile", "Erro no fallback de verificação de admin", appError);
    return false;
  }
};
