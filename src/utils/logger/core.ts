
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { LogLevel, LogContext, LogEntry } from "@/types/log";
import { getFormattedTimestamp } from './formatters';
import { isDevelopment } from './environment';
import { AppError, toAppError } from "@/types/extended-error";

// Função auxiliar para formatar entradas de log
const formatLogEntry = (entry: LogEntry): string => {
  const { level, module, message, context, error } = entry;
  
  let formattedMessage = `[${level.toUpperCase()}] [${module}] ${message}`;
  
  if (context) {
    formattedMessage += ` | Context: ${JSON.stringify(context)}`;
  }
  
  if (error) {
    formattedMessage += ` | Error: ${error.message}`;
    if (error.stack) {
      formattedMessage += `\n${error.stack}`;
    }
  }
  
  return formattedMessage;
};

// Função simplificada para persistir logs
const persistLog = async (entry: LogEntry): Promise<void> => {
  if (isDevelopment()) {
    return; // Não persistir logs em desenvolvimento
  }
  
  try {
    console.log("Persistindo log:", entry);
    // Implementação real de persistência ficaria aqui
  } catch (error) {
    console.warn("Erro ao persistir log:", error);
  }
};

const log = async (
  level: LogLevel,
  module: string,
  message: string,
  context?: LogContext,
  error?: Error | AppError,
  isSystemLog: boolean = false
): Promise<void> => {
  try {
    let userId: string | undefined;
    
    if (!isSystemLog) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id;
      } catch (sessionError) {
        console.warn('Erro ao obter sessão do usuário:', sessionError);
      }
    }

    const entry: LogEntry = {
      level,
      module,
      message,
      timestamp: getFormattedTimestamp(),
      context,
      error,
      userId
    };

    const logMessage = formatLogEntry(entry);
    switch (level) {
      case 'info':
        console.info(logMessage);
        break;
      case 'warning':
        console.warn(logMessage);
        break;
      case 'error':
      case 'critical':
        console.error(logMessage);
        if (isDevelopment()) {
          toast.error(message);
        }
        break;
    }

    persistLog(entry).catch(persistError => {
      console.warn('Falha ao persistir log:', persistError);
    });
  } catch (logError) {
    console.error('Erro crítico no sistema de logging:', logError);
  }
};

export const logger = {
  system: {
    info: (module: string, message: string, context?: LogContext) => 
      log('info', module, message, context, undefined, true),
    
    warning: (module: string, message: string, context?: LogContext) => 
      log('warning', module, message, context, undefined, true),
    
    error: (module: string, message: string, error?: Error | unknown, context?: LogContext) => 
      log('error', module, message, context, error instanceof Error ? error : toAppError(error), true),
      
    critical: (module: string, message: string, error?: Error | unknown, context?: LogContext) => 
      log('critical', module, message, context, error instanceof Error ? error : toAppError(error), true)
  },

  info: (module: string, message: string, context?: LogContext) => 
    log('info', module, message, context),
  
  warning: (module: string, message: string, context?: LogContext) => 
    log('warning', module, message, context),
  
  error: (module: string, message: string, error?: Error | unknown, context?: LogContext) => 
    log('error', module, message, context, error instanceof Error ? error : toAppError(error)),
    
  critical: (module: string, message: string, error?: Error | unknown, context?: LogContext) => 
    log('critical', module, message, context, error instanceof Error ? error : toAppError(error))
};
