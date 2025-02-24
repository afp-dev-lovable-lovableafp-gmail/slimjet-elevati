
export interface AuthFormProps {
  isAdmin?: boolean;
}

export interface AuthFormData {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
}
