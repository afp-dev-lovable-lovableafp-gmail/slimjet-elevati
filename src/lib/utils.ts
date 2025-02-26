
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária para combinar classes CSS de forma segura.
 * Utiliza clsx e tailwind-merge para lidar com conflitos de classes.
 * 
 * @example
 * ```tsx
 * const className = cn(
 *   "base-class",
 *   isActive && "active-class",
 *   variant === "primary" ? "primary-class" : "secondary-class"
 * );
 * ```
 * 
 * @param inputs - Classes CSS a serem combinadas
 * @returns String de classes CSS combinadas e tratadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

