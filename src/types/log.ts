
import { AppError } from './extended-error';

export type LogLevel = 'info' | 'warning' | 'error' | 'critical';

export type LogContext = Record<string, any>;

export interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error | AppError;
  userId?: string;
}

export interface LoggerOptions {
  persist?: boolean;
  notify?: boolean;
}
