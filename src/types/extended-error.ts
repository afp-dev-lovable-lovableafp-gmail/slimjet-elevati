
export interface ExtendedErrorData {
  message?: string;
  code?: string;
  details?: string | Record<string, any>;
  hint?: string;
  email?: string;
  userId?: string;
  stack?: string;
  name?: string;
  timestamp?: string;
  context?: Record<string, any>;
  [key: string]: any; // Para permitir propriedades adicionais
}

export class AppError extends Error {
  code?: string;
  details?: string | Record<string, any>;
  hint?: string;
  email?: string;
  userId?: string;
  context?: Record<string, any>;
  timestamp?: string;
  
  constructor(message: string, data?: ExtendedErrorData) {
    super(message);
    this.name = 'AppError';
    
    if (data) {
      Object.assign(this, data);
    }
  }
}

// Auxiliar para converter erros comuns em AppError
export function toAppError(error: unknown, additionalData?: ExtendedErrorData): AppError {
  if (error instanceof AppError) {
    if (additionalData) {
      Object.assign(error, additionalData);
    }
    return error;
  }
  
  const message = error instanceof Error ? error.message : String(error);
  return new AppError(message, {
    ...additionalData,
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : 'UnknownError',
  });
}
