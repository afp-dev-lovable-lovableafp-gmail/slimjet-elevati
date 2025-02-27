
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  is_admin: boolean;
  user_type: string;
  full_name: string;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  authenticated: boolean;
}

export interface OAuthLoginParams {
  provider: 'google' | 'github' | 'facebook';
  redirectTo?: string;
}
