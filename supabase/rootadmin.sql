
-- Garantir que as extensões necessárias estão presentes (sem tentar remover)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Garantir todas as permissões necessárias
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

-- Recriar apenas as tabelas necessárias mantendo o schema
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;

-- Recriar a tabela de usuários com estrutura completa
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    encrypted_password text NOT NULL,
    email_confirmed_at timestamp with time zone DEFAULT now(),
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Garantir permissões específicas na tabela users
GRANT ALL ON TABLE auth.users TO postgres, service_role;
GRANT SELECT ON TABLE auth.users TO anon;
GRANT SELECT, UPDATE ON TABLE auth.users TO authenticated;

-- Recriar a tabela de perfis
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    company_name text,
    phone text,
    is_admin boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Configurar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recriar políticas de segurança
DROP POLICY IF EXISTS "Permitir acesso público aos perfis" ON public.profiles;
CREATE POLICY "Permitir acesso público aos perfis"
ON public.profiles FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir atualização do próprio perfil" ON public.profiles;
CREATE POLICY "Permitir atualização do próprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Permitir inserção do próprio perfil" ON public.profiles;
CREATE POLICY "Permitir inserção do próprio perfil"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Recriar função e trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Recriar o usuário admin com o UUID fixo
DO $$
DECLARE
    admin_id uuid := '599723b2-165a-4cb4-a143-20c3ec7df583';
BEGIN
    -- Limpar dados existentes do admin
    DELETE FROM auth.users WHERE email = 'admin@elevati.com.br';
    
    -- Inserir usuário admin
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    )
    VALUES (
        admin_id,
        'admin@elevati.com.br',
        crypt('Admin@123', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"],"is_admin":true}'::jsonb,
        '{"full_name":"Administrador"}'::jsonb,
        now(),
        now()
    );

    -- Inserir ou atualizar perfil do admin
    INSERT INTO public.profiles (
        id,
        full_name,
        is_admin,
        created_at,
        updated_at
    )
    VALUES (
        admin_id,
        'Administrador',
        true,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        is_admin = true,
        updated_at = now();
END $$;

-- Recriar função check_if_admin com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_if_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id AND is_admin = true
    );
END;
$$;

-- Garantir permissões na função check_if_admin
REVOKE ALL ON FUNCTION public.check_if_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_if_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_if_admin(uuid) TO anon;

-- Garantir permissões nas tabelas
GRANT ALL ON TABLE public.profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON public.profiles(is_admin);
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);

