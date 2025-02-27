
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

export interface AuthFormProps {
  isAdmin?: boolean;
  hideRegister?: boolean;
}

// Tipo genérico para compatibilidade com diferentes formulários
export interface LoginFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isRegistering: boolean;
}

export interface RegisterFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export interface FormButtonsProps {
  isSubmitting: boolean;
  isRegistering: boolean;
  onToggleMode: () => void;
  hideToggle?: boolean;
}
