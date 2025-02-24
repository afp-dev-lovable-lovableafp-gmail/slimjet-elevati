
import { toast } from "sonner";

type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const log = (level: LogLevel, module: string, message: string, context?: LogContext) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`;
  
  // Console logging
  switch (level) {
    case 'info':
      console.info(logMessage, context);
      break;
    case 'warn':
      console.warn(logMessage, context);
      break;
    case 'error':
      console.error(logMessage, context);
      // Show error toast for errors
      toast.error(message);
      break;
  }
};

export const logger = {
  info: (module: string, message: string, context?: LogContext) => 
    log('info', module, message, context),
  
  warn: (module: string, message: string, context?: LogContext) => 
    log('warn', module, message, context),
  
  error: (module: string, message: string, context?: LogContext) => 
    log('error', module, message, context)
};
