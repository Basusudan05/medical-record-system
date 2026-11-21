import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

/**
 * Supabase admin client — uses the service-role key.
 * This bypasses RLS and must NEVER be exposed to the frontend.
 * Used only for server-side operations: storage downloads, ownership checks.
 */
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('[supabaseAdmin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

export const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
