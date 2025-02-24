
import { toast } from "sonner";
import type { AppError, ErrorConfig, ErrorHandler } from "@/types/error";

const errorHandlers: Record<string, ErrorHandler> = {
  'auth/invalid-credentials': {
    code: 'auth/invalid-credentials',
    message: 'Credenciais inválidas. Por favor, verifique seus dados.',
    config: { severity: 'warning', showToast: true }
  },
  'appointments/fetch-failed': {
    code: 'appointments/fetch-failed',
    message: 'Não foi possível carregar os agendamentos.',
    config: { severity: 'error', showToast: true }
  },
  'appointments/update-failed': {
    code: 'appointments/update-failed',
    message: 'Erro ao atualizar o agendamento.',
    config: { severity: 'error', showToast: true }
  },
  'appointments/delete-failed': {
    code: 'appointments/delete-failed',
    message: 'Erro ao excluir o agendamento.',
    config: { severity: 'error', showToast: true }
  },
  'network/offline': {
    code: 'network/offline',
    message: 'Você está offline. Verifique sua conexão.',
    config: { severity: 'warning', showToast: true }
  }
};

export const handleError = (error: unknown, defaultMessage?: string): AppError => {
  console.error('Error occurred:', error);
  
  let appError: AppError;

  if (error instanceof Error) {
    const errorCode = (error as any).code || 'unknown';
    const handler = errorHandlers[errorCode];

    if (handler) {
      appError = {
        code: handler.code,
        message: handler.message,
        originalError: error
      };

      if (handler.config.showToast) {
        toast.error(handler.message);
      }
    } else {
      appError = {
        code: 'unknown',
        message: defaultMessage || error.message,
        originalError: error
      };
      toast.error(appError.message);
    }
  } else {
    appError = {
      code: 'unknown',
      message: defaultMessage || 'Ocorreu um erro inesperado.',
      originalError: error
    };
    toast.error(appError.message);
  }

  return appError;
};
