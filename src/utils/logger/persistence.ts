
import { supabase } from "@/lib/supabase";
import type { LogEntry } from "@/types/log";
import { LOGGER_CONFIG } from './config';
import { isDevelopment } from './environment';
import { sanitizeError } from './formatters';
import type { LogData } from './types';
import type { Json } from "@/types/database.types";

export const persistLog = async (entry: LogEntry): Promise<void> => {
  if (isDevelopment()) {
    console.debug('Skipping log persistence in development mode');
    return;
  }
  
  let retries = 0;
  let success = false;
  
  while (retries < LOGGER_CONFIG.maxRetries && !success) {
    try {
      const logData: LogData = {
        level: entry.level,
        module: entry.module,
        message: entry.message,
        context: entry.context as Json,
        error_details: entry.error ? sanitizeError(entry.error) : null,
        user_id: entry.userId || null,
        created_at: entry.timestamp,
        updated_at: entry.timestamp
      };

      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao tentar persistir log')), LOGGER_CONFIG.logTimeout)
      );

      const result = await Promise.race([
        supabase.from('system_logs').insert(logData),
        timeoutPromise
      ]);
      
      if ('error' in result && result.error) {
        console.warn(`Falha ao persistir log (tentativa ${retries + 1}):`, result.error);
        
        if (retries === LOGGER_CONFIG.maxRetries - 1) {
          console.debug('Dados do log não persistidos:', logData);
        }
      } else {
        success = true;
      }
    } catch (error) {
      console.warn(`Erro ao tentar persistir log (tentativa ${retries + 1}):`, error);
    }
    
    retries++;
    
    if (!success && retries < LOGGER_CONFIG.maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
};

