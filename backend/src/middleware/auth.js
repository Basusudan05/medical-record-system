import { supabaseAdmin } from '../config/supabaseAdmin.js';

/**
 * requireAuth middleware
 * Reads the Authorization: Bearer <token> header,
 * verifies it with Supabase, and attaches the authenticated user to req.user.
 * Returns 401 if the token is missing or invalid.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing authentication token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    }

    req.user = user; // { id, email, ... }
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Authentication failed.' });
  }
}
