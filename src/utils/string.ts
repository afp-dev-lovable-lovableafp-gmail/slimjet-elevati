
/**
 * Obtém as iniciais de um nome
 * @param name - Nome completo 
 * @returns Iniciais (máximo 2 caracteres)
 */
export const getInitials = (name: string): string => {
  if (!name) return "??";
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (
    (parts[0]?.[0] || '') + 
    (parts[parts.length - 1]?.[0] || '')
  ).toUpperCase();
};

/**
 * Trunca um texto com reticências se exceder o tamanho máximo
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo (padrão: 100)
 * @returns Texto truncado
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Formata um número de telefone para exibição
 * @param phone - Número de telefone (apenas dígitos)
 * @returns Número formatado: (xx) xxxxx-xxxx
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, '');
  
  // Formata para (XX) XXXXX-XXXX
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  
  // Formata para (XX) XXXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  
  return phone;
};
