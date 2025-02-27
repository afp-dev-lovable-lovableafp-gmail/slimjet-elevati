
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthFormData } from "@/types/auth";

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
