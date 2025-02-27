
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  auth_id?: string;
  is_admin: boolean | null;
  user_type: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Campos opcionais do profile que podem vir do cliente
  full_name?: string | null;
  company_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  email?: string | null;
}

export interface Client {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  client: Client | null;
  loading: boolean;
  error: Error | null;
  authenticated: boolean;
  isAdmin?: boolean;
  isTeamMember?: boolean;
  isClient?: boolean;
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

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  client: Client | null;
  loading: boolean;
  authenticated: boolean;
  isAdmin?: boolean;
  isTeamMember?: boolean;
  isClient?: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<any>;
  signOut: () => Promise<void>;
}
