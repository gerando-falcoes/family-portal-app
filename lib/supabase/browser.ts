import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Em ambiente de desenvolvimento, isso ajuda a detectar configuração ausente cedo
  // Evite lançar erros em runtime do navegador se preferir falhar silenciosamente
  // Aqui optamos por lançar para explicitar o problema de configuração
  throw new Error('Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. Verifique .env.local');
}

export const supabaseBrowserClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabaseBrowserClient;



