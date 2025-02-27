
import { format, fromZonedTime } from 'date-fns-tz';
import type { LogEntry } from "@/types/log";
import { LOGGER_CONFIG } from './config';

export const formatLogEntry = (entry: LogEntry): string => {
  const contextStr = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : '';
  const errorStr = entry.error ? ` | error: ${entry.error.message}` : '';
  const userStr = entry.userId ? ` | userId: ${entry.userId}` : ' | system';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.module}] ${entry.message}${contextStr}${errorStr}${userStr}`;
};

export const getFormattedTimestamp = (): string => {
  const now = new Date();
  const zonedTime = fromZonedTime(now, LOGGER_CONFIG.timezone);
  return format(zonedTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: LOGGER_CONFIG.timezone });
};

export const sanitizeError = (error: Error): Record<string, string> => {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack || 'No stack trace available'
  };
};

