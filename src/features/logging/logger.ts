
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { LogLevel, LogContext } from "@/types/log";
import type { Json } from "@/integrations/supabase/types";

const log = (level: LogLevel, module: string, message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`;
  
  // Console logging
  switch (level) {
    case 'info':
      console.info(logMessage, context);
      break;
    case 'warning':
      console.warn(logMessage, context);
      break;
    case 'error':
    case 'critical':
      console.error(logMessage, context);
      // Show error toast for errors
      toast.error(message);
      break;
  }

  // Persist to database
  try {
    supabase.from('system_logs').insert({
      level,
      module,
      message,
      context: context as Json,
      created_at: timestamp,
      updated_at: timestamp
    }).then(({ error }) => {
      if (error) {
        console.error('Failed to persist log:', error);
      }
    });
  } catch (error) {
    console.error('Error persisting log:', error);
  }
};

export const logger = {
  info: (module: string, message: string, context?: LogContext) => 
    log('info', module, message, context),
  
  warn: (module: string, message: string, context?: LogContext) => 
    log('warning', module, message, context),
  
  error: (module: string, message: string, context?: LogContext) => 
    log('error', module, message, context)
};
