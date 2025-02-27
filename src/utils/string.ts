
/**
 * Extrai as iniciais de um nome.
 * @param name Nome completo
 * @returns As iniciais do nome (até 2 caracteres)
 */
export const getInitials = (name?: string | null): string => {
  if (!name) return "?";
  
  // Dividir o nome por espaços e pegar a primeira letra de cada parte
  const nameParts = name.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    // Se for um nome único, pegar as duas primeiras letras
    return name.substring(0, 2).toUpperCase();
  }
  
  // Pegar a primeira letra do primeiro nome e a primeira letra do último nome
  const firstInitial = nameParts[0][0] || '';
  const lastInitial = nameParts[nameParts.length - 1][0] || '';
  
  return (firstInitial + lastInitial).toUpperCase();
};
