
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  auth_id?: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  phone: string | null;
  email?: string | null;
  updated_at: string | null;
  created_at?: string | null;
  is_admin?: boolean;
  user_type?: string;
}

export interface UpdateProfileDTO extends Partial<Profile> {
  id: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  authenticated: boolean;
}

export interface AuthFormData {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  confirmPassword?: string;
}

export interface AuthFormProps {
  isAdmin?: boolean;
}
