import FormData from 'form-data';
import fetch from 'node-fetch';
import { config } from '../config/env.js';

const OCR_API_URL = 'https://api.ocr.space/parse/image';

// OCR.space free-tier limits
const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

/**
 * validateFileForOcr
 * Returns an error string if the file fails OCR.space constraints, otherwise null.
 *
 * @param {Buffer} fileBuffer
 * @param {string} mimeType
 */
export function validateFileForOcr(fileBuffer, mimeType) {
  if (!SUPPORTED_TYPES.includes(mimeType)) {
    return `Unsupported file type "${mimeType}". OCR supports JPG, PNG, WEBP, and PDF.`;
  }
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(1);
    return `File is ${sizeMB} MB. OCR.space free tier supports files up to 1 MB. Please compress the file and try again.`;
  }
  return null;
}

/**
 * runOcr
 * Sends a file buffer to OCR.space and returns structured results.
 *
 * @param {object} options
 * @param {Buffer}  options.fileBuffer   — raw file bytes
 * @param {string}  options.mimeType     — MIME type e.g. 'image/jpeg'
 * @param {string}  options.fileName     — original file name (used by OCR.space)
 * @param {number}  options.engine       — 2 (printed) or 3 (handwriting). Default: 3
 *
 * @returns {{ success: boolean, text?: string, error?: string, raw?: object }}
 */
export async function runOcr({ fileBuffer, mimeType, fileName, engine = 3 }) {
  if (!config.ocrSpaceApiKey) {
    return { success: false, error: 'OCR service is not configured. Contact the administrator.' };
  }

  // Validate before sending
  const validationError = validateFileForOcr(fileBuffer, mimeType);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const form = new FormData();
  form.append('file', fileBuffer, {
    filename:    fileName,
    contentType: mimeType,
  });
  form.append('language',         'eng');
  form.append('OCREngine',        String(engine));
  form.append('isOverlayRequired','false');
  form.append('detectOrientation','true');
  form.append('scale',            'true');

  try {
    const response = await fetch(OCR_API_URL, {
      method:  'POST',
      headers: {
        apikey: config.ocrSpaceApiKey,
        ...form.getHeaders(),
      },
      body:    form,
      signal:  AbortSignal.timeout(30_000), // 30 second timeout
    });

    if (!response.ok) {
      const body = await response.text();
      return { success: false, error: `OCR API returned HTTP ${response.status}.` };
    }

    const data = await response.json();

    // OCR.space error codes
    if (data.OCRExitCode === 99) {
      return { success: false, error: 'OCR daily limit exceeded. Please try again tomorrow.' };
    }
    if (data.IsErroredOnProcessing) {
      const msg = data.ErrorMessage?.[0] || data.ErrorDetails || 'OCR processing failed.';
      return { success: false, error: msg };
    }

    // Extract text from all parsed pages
    const pages = data.ParsedResults || [];
    if (pages.length === 0) {
      return { success: false, error: 'No text could be extracted from this document.' };
    }

    const extractedText = pages
      .map(p => (p.ParsedText || '').trim())
      .filter(Boolean)
      .join('\n\n--- Page break ---\n\n');

    if (!extractedText) {
      return { success: false, error: 'The document appears to contain no readable text.' };
    }

    return {
      success: true,
      text:    extractedText,
      engine,
      pages:   pages.length,
      raw:     data, // kept for debugging, never logged to production
    };

  } catch (e) {
    if (e.name === 'TimeoutError' || e.name === 'AbortError') {
      return { success: false, error: 'OCR request timed out. Please try again.' };
    }
    return { success: false, error: 'Could not reach the OCR service. Check your network connection.' };
  }
}
