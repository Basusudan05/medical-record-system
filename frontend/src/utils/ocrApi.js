import { supabase } from '../lib/supabase';

/**
 * API calls use a RELATIVE base path (/api/...) so the Vite dev-server
 * proxy forwards them to http://localhost:5000.
 * This avoids CORS issues caused by cross-origin fetch from the browser.
 *
 * In production the same relative path works because the frontend and
 * backend are served from the same domain, or a reverse proxy is in place.
 */
const API_BASE = '/api';

async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? `Bearer ${session.access_token}` : null;
}

/**
 * startOcr — POST /api/ocr/process/:recordId
 */
export async function startOcr(recordId, { engine = 3, force = false } = {}) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    const res = await fetch(`${API_BASE}/ocr/process/${recordId}`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ engine, force }),
    });

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || `Server error (${res.status}).` };
    return data;

  } catch (e) {
    return {
      success: false,
      error: 'Cannot reach the backend server. Make sure it is running (cd backend && npm run dev).',
    };
  }
}

/**
 * getOcrResult — GET /api/ocr/result/:recordId
 */
export async function getOcrResult(recordId) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    const res = await fetch(`${API_BASE}/ocr/result/${recordId}`, {
      headers: { 'Authorization': token },
    });

    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || `Server error (${res.status}).` };
    return data;

  } catch (e) {
    return { success: false, error: 'Could not fetch OCR result.' };
  }
}
