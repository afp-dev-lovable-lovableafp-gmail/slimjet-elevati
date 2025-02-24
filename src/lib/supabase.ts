
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = 'https://oahllcmgpeyncgaeiaqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haGxsY21ncGV5bmNnYWVpYXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDUzNTksImV4cCI6MjA1NTc4MTM1OX0.gaMHNBJHLziTJYnR6dN8SV7Ay7J1l11UrhnRCwTBLwg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase-auth',
    storage: window.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Auth] Estado alterado:', {
    event,
    userId: session?.user?.id,
    timestamp: new Date().toISOString()
  });
});
