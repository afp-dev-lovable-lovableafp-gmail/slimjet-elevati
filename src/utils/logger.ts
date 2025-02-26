
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { format, fromZonedTime } from 'date-fns-tz';
import type { LogLevel, LogContext, LogEntry } from "@/types/log";
import type { Json } from "@/integrations/supabase/types";

const TIMEZONE = 'America/Sao_Paulo';

const formatLogEntry = (entry: LogEntry): string => {
  const contextStr = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : '';
  const errorStr = entry.error ? ` | error: ${entry.error.message}` : '';
  const userStr = entry.userId ? ` | userId: ${entry.userId}` : ' | system';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.module}] ${entry.message}${contextStr}${errorStr}${userStr}`;
};

const getFormattedTimestamp = (): string => {
  const now = new Date();
  const zonedTime = fromZonedTime(now, TIMEZONE);
  return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: TIMEZONE });
};

const sanitizeError = (error: Error): Record<string, string> => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack || 'No stack trace available'
  };
};

const persistLog = async (entry: LogEntry): Promise<void> => {
  try {
    const logData = {
      level: entry.level,
      module: entry.module,
      message: entry.message,
      context: entry.context as Json,
      error_details: entry.error ? sanitizeError(entry.error) : null,
      user_id: entry.userId || null, // Explicitly set null for system logs
      created_at: entry.timestamp,
      updated_at: entry.timestamp
    };

    // For system-level logs (no user_id), we don't need authentication
    const { error: insertError } = await supabase
      .from('system_logs')
      .insert(logData);

    if (insertError) {
      console.error('Failed to persist log:', insertError);
      if (process.env.NODE_ENV === 'development') {
        console.debug('Log data that failed:', logData);
      }
    }
  } catch (error) {
    console.error('Error persisting log:', error);
  }
};

const log = async (
  level: LogLevel,
  module: string,
  message: string,
  context?: LogContext,
  error?: Error,
  isSystemLog: boolean = false
): Promise<void> => {
  try {
    let userId: string | undefined;
    
    if (!isSystemLog) {
      // Only try to get user session for non-system logs
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
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

    // Log to console with appropriate method
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
        if (process.env.NODE_ENV === 'development') {
          toast.error(message);
        }
        break;
    }

    // Persist log to database
    await persistLog(entry);
  } catch (error) {
    console.error('Critical error in logging system:', error);
  }
};

export const logger = {
  // System-level logging (no user context)
  system: {
    info: (module: string, message: string, context?: LogContext) => 
      log('info', module, message, context, undefined, true),
    
    warning: (module: string, message: string, context?: LogContext) => 
      log('warning', module, message, context, undefined, true),
    
    error: (module: string, message: string, error?: Error, context?: LogContext) => 
      log('error', module, message, context, error, true),
      
    critical: (module: string, message: string, error?: Error, context?: LogContext) => 
      log('critical', module, message, context, error, true)
  },

  // User-level logging (with user context when available)
  info: (module: string, message: string, context?: LogContext) => 
    log('info', module, message, context),
  
  warning: (module: string, message: string, context?: LogContext) => 
    log('warning', module, message, context),
  
  error: (module: string, message: string, error?: Error, context?: LogContext) => 
    log('error', module, message, context, error),
    
  critical: (module: string, message: string, error?: Error, context?: LogContext) => 
    log('critical', module, message, context, error)
};
