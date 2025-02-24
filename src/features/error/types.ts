
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: unknown;
}

export const ErrorCodes = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'auth/invalid-credentials',
    SESSION_EXPIRED: 'auth/session-expired',
    UNAUTHORIZED: 'auth/unauthorized',
  },
  APPOINTMENTS: {
    FETCH_FAILED: 'appointments/fetch-failed',
    CREATE_FAILED: 'appointments/create-failed',
    UPDATE_FAILED: 'appointments/update-failed',
    DELETE_FAILED: 'appointments/delete-failed',
  },
  SERVICES: {
    FETCH_FAILED: 'services/fetch-failed',
    UPDATE_FAILED: 'services/update-failed',
  },
} as const;
