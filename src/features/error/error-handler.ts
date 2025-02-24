
import { toast } from "sonner";
import { ErrorCodes } from "./types";
import type { AppError } from "./types";

const ERROR_MESSAGES = {
  [ErrorCodes.AUTHENTICATION.INVALID_CREDENTIALS]: 'Credenciais inválidas',
  [ErrorCodes.AUTHENTICATION.SESSION_EXPIRED]: 'Sua sessão expirou',
  [ErrorCodes.AUTHENTICATION.UNAUTHORIZED]: 'Acesso não autorizado',
  [ErrorCodes.APPOINTMENTS.FETCH_FAILED]: 'Erro ao carregar agendamentos',
  [ErrorCodes.APPOINTMENTS.CREATE_FAILED]: 'Erro ao criar agendamento',
  [ErrorCodes.APPOINTMENTS.UPDATE_FAILED]: 'Erro ao atualizar agendamento',
  [ErrorCodes.APPOINTMENTS.DELETE_FAILED]: 'Erro ao excluir agendamento',
  [ErrorCodes.SERVICES.FETCH_FAILED]: 'Erro ao carregar serviços',
  [ErrorCodes.SERVICES.UPDATE_FAILED]: 'Erro ao atualizar serviço',
} as const;

export const handleError = (error: unknown, errorCode?: keyof typeof ERROR_MESSAGES): AppError => {
  console.error('[Error Handler]:', error);

  const appError: AppError = {
    code: errorCode || 'unknown',
    message: errorCode ? ERROR_MESSAGES[errorCode] : 'Ocorreu um erro inesperado',
    originalError: error
  };

  // Show toast notification
  toast.error(appError.message);

  return appError;
};
