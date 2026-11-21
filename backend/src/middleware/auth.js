import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

/**
 * We use the service-role client to call auth.getUser(token).
 * Per Supabase docs, supabaseAdmin.auth.getUser(jwt) validates the user
 * JWT using the project's JWT secret — this is the correct server-side approach.
 *
 * Key point: we must NOT use the service-role client's own auth session.
 * We pass the user's access_token explicitly to getUser(), which triggers
 * server-side JWT verification rather than a session lookup.
 */
const supabaseAuth = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken:  false,
      persistSession:    false,
      detectSessionInUrl: false,
    },
    global: {
      // Pass the user token on every request so Supabase verifies it
      headers: {},
    },
  }
);

/**
 * requireAuth middleware
 * Verifies the Supabase JWT from Authorization: Bearer <token>
 * and attaches the authenticated user to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing authentication token.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.split('.').length !== 3) {
    return res.status(401).json({ success: false, error: 'Malformed authentication token.' });
  }

  try {
    // getUser(token) validates the JWT against the Supabase project secret
    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error) {
      console.error('[auth] getUser error:', error.message);
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }

    if (!data?.user) {
      return res.status(401).json({ success: false, error: 'User not found.' });
    }

    req.user = data.user;
    next();
  } catch (e) {
    console.error('[auth] unexpected error:', e.message);
    return res.status(401).json({ success: false, error: 'Authentication failed.' });
  }
}
