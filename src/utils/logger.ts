
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { format, fromZonedTime } from 'date-fns-tz';
import type { LogLevel, LogContext, LogEntry } from "@/types/log";
import type { Json } from "@/integrations/supabase/types";

const TIMEZONE = 'America/Sao_Paulo';

const formatLogEntry = (entry: LogEntry): string => {
  const contextStr = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : '';
  const errorStr = entry.error ? ` | error: ${entry.error.message}` : '';
  const userStr = entry.userId ? ` | userId: ${entry.userId}` : '';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.module}] ${entry.message}${contextStr}${errorStr}${userStr}`;
};

const getFormattedTimestamp = (): string => {
  const now = new Date();
  const zonedTime = fromZonedTime(now, TIMEZONE);
  return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: TIMEZONE });
};

const persistLog = async (entry: LogEntry) => {
  try {
    const logData = {
      level: entry.level,
      module: entry.module,
      message: entry.message,
      context: entry.context as Json,
      error_details: entry.error ? {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack
      } : null,
      user_id: entry.userId || null,
      created_at: entry.timestamp,
      updated_at: entry.timestamp
    };

    const { error } = await supabase
      .from('system_logs')
      .insert(logData);

    if (error) {
      console.error('Failed to persist log:', error);
    }
  } catch (error) {
    console.error('Error persisting log:', error);
  }
};

const log = async (level: LogLevel, module: string, message: string, context?: LogContext, error?: Error) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

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
      console.error(logMessage);
      // For errors, also show user-friendly toast
      toast.error(message);
      break;
  }

  // Persist log to database
  await persistLog(entry);
};

export const logger = {
  info: (module: string, message: string, context?: LogContext) => 
    log('info', module, message, context),
  
  warning: (module: string, message: string, context?: LogContext) => 
    log('warning', module, message, context),
  
  error: (module: string, message: string, error?: Error, context?: LogContext) => 
    log('error', module, message, context, error)
};
