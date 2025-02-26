
import { UseFormRegister, FieldErrors } from "react-hook-form";

export interface AuthFormData {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
}

export interface AuthFormProps {
  isAdmin?: boolean;
  hideRegister?: boolean;
}

export interface LoginFieldsProps {
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors<AuthFormData>;
  isRegistering: boolean;
}

export interface FormButtonsProps {
  isSubmitting: boolean;
  isRegistering: boolean;
  onToggleMode: () => void;
  hideToggle?: boolean;
}
