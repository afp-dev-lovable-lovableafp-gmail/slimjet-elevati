
export type LogLevel = 'info' | 'warning' | 'error' | 'critical';
export type LogContext = Record<string, unknown>;

export interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  userId?: string;
}

export interface SystemLog {
  id: string;
  level: LogLevel;
  module: string;
  message: string;
  context?: LogContext;
  error_details?: {
    name: string;
    message: string;
    stack?: string;
  };
  user_id?: string;
  created_at: string;
  updated_at: string;
}
