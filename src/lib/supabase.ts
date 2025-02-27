
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Usando as informações corretas do projeto Supabase
const supabaseUrl = 'https://lvhsdntaskmrvcipybaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2aHNkbnRhc2ttcnZjaXB5YmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NzA5ODYsImV4cCI6MjA1NjE0Njk4Nn0.MPE094s7bS_kccl-hUCvtO2WwkgeyeQ07bEAl7Slz08';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

let supabaseInstance;

try {
  // Criando o cliente Supabase com configurações seguras
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'supabase-auth',
      storage: window.localStorage,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: true, // Ativando debug para ajudar na solução de problemas
      autoRefreshToken: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });
} catch (error) {
  console.error('Erro ao inicializar o cliente Supabase:', error);
  
  // Criando um cliente de fallback (não funcional) para evitar crashes da aplicação
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Cliente Supabase não inicializado') }),
      signUp: async () => ({ data: null, error: new Error('Cliente Supabase não inicializado') }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null })
        }),
        order: () => ({
          limit: () => ({
            maybeSingle: async () => ({ data: null, error: null })
          })
        })
      }),
      insert: () => ({ error: null }),
      update: () => ({ eq: () => ({ error: null }) }),
      delete: () => ({ eq: () => ({ error: null }) })
    }),
    rpc: () => ({ data: null, error: null }),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  } as any;
}

// Exportando o cliente Supabase
export const supabase = supabaseInstance;
