
import type { Json } from "@/types/database.types";
import type { LogLevel } from "@/types/log";

export interface LoggerConfig {
  timezone: string;
  logTimeout: number;
  maxRetries: number;
}

export interface LogData {
  level: LogLevel;
  module: string;
  message: string;
  context: Json;
  error_details: Record<string, string> | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

