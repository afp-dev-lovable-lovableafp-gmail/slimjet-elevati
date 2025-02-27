
export interface FormProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  avatar_url: string | null;
  email?: string | null;
}

// Adicionando tipo para perfis completos incluindo os campos do banco de dados
export interface Profile {
  id: string;
  auth_id?: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  avatar_url: string | null;
  email?: string | null;
  user_type?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}
