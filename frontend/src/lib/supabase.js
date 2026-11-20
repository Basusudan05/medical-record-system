import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log a clear warning during development if variables are missing or look wrong.
// A missing/wrong key causes a silent white screen — this surfaces the problem.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[MediVault] Supabase env vars missing.\n' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env\n' +
    'Get them from: Supabase Dashboard → Project Settings → API'
  );
}

if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.error(
    '[MediVault] VITE_SUPABASE_ANON_KEY looks wrong.\n' +
    'The anon key must be a JWT starting with "eyJ".\n' +
    'Get it from: Supabase Dashboard → Project Settings → API → anon public'
  );
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
