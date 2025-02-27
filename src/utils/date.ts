
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata uma data para exibição
 * @param dateString - String de data ISO
 * @param formatStr - Formato de saída (usando tokens date-fns)
 * @returns String de data formatada
 */
export const formatDate = (dateString: string, formatStr: string = "PPP"): string => {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

/**
 * Formata uma hora para exibição
 * @param dateString - String de data ISO
 * @returns String de hora formatada (HH:mm)
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar hora:", error);
    return "Hora inválida";
  }
};

/**
 * Formata uma data e hora para exibição
 * @param dateString - String de data ISO
 * @returns String de data e hora formatada
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    return format(date, "PPP 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data e hora:", error);
    return "Data/hora inválida";
  }
};
