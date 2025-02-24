
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: unknown;
}

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorConfig {
  severity: ErrorSeverity;
  showToast?: boolean;
  toastDuration?: number;
}

export interface ErrorHandler {
  code: string;
  message: string;
  config: ErrorConfig;
}

export const ErrorCodes = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'auth/invalid-credentials',
    SESSION_EXPIRED: 'auth/session-expired',
    UNAUTHORIZED: 'auth/unauthorized',
  },
  APPOINTMENTS: {
    FETCH_FAILED: 'appointments/fetch-failed',
    UPDATE_FAILED: 'appointments/update-failed',
    DELETE_FAILED: 'appointments/delete-failed',
    INVALID_STATUS: 'appointments/invalid-status',
  },
  SERVICES: {
    FETCH_FAILED: 'services/fetch-failed',
    UPDATE_FAILED: 'services/update-failed',
  },
  NETWORK: {
    OFFLINE: 'network/offline',
    TIMEOUT: 'network/timeout',
  },
} as const;
