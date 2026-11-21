import { supabase } from '../lib/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * getAuthToken
 * Reads the current Supabase session JWT and returns it as a Bearer header value.
 * Returns null if not authenticated.
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? `Bearer ${session.access_token}` : null;
}

/**
 * startOcr
 * Calls POST /api/ocr/process/:recordId on the backend.
 * The backend downloads the file server-side and calls OCR.space.
 *
 * @param {string} recordId
 * @param {{ engine?: 2|3, force?: boolean }} options
 * @returns {{ success, extractedText?, cached?, error? }}
 */
export async function startOcr(recordId, { engine = 3, force = false } = {}) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    const res = await fetch(`${API_BASE}/api/ocr/process/${recordId}`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ engine, force }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || `Server error (${res.status}).` };
    }

    return data;
  } catch (e) {
    if (e.name === 'TypeError' && e.message.includes('fetch')) {
      return {
        success: false,
        error: 'Cannot reach the backend server. Make sure it is running on port 5000.',
      };
    }
    return { success: false, error: e.message || 'OCR request failed.' };
  }
}

/**
 * getOcrResult
 * Calls GET /api/ocr/result/:recordId — returns saved OCR text if available.
 *
 * @param {string} recordId
 * @returns {{ success, extractedText?, processingStatus?, extractedAt?, error? }}
 */
export async function getOcrResult(recordId) {
  const token = await getAuthToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    const res = await fetch(`${API_BASE}/api/ocr/result/${recordId}`, {
      headers: { 'Authorization': token },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || `Server error (${res.status}).` };
    }

    return data;
  } catch (e) {
    return { success: false, error: e.message || 'Could not fetch OCR result.' };
  }
}
