import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { runOcr } from '../services/ocrService.js';

const router = Router();

// All OCR routes require authentication
router.use(requireAuth);

/**
 * POST /api/ocr/process/:recordId
 * Triggers OCR on an existing medical document.
 *
 * Body (optional):
 *   engine — 2 (printed) | 3 (handwriting, default)
 *
 * Flow:
 *   1. Verify the record belongs to req.user.id
 *   2. Check if OCR already ran (avoid duplicate requests)
 *   3. Set processing_status = 'processing'
 *   4. Download file from Supabase Storage via service-role key
 *   5. Send to OCR.space
 *   6. Save extracted_text to extracted_data table
 *   7. Update processing_status = 'completed' | 'failed'
 */
router.post('/process/:recordId', async (req, res, next) => {
  const { recordId } = req.params;
  const engine = Number(req.body?.engine) || 3;
  const userId = req.user.id;

  try {
    // ── 1. Fetch record and verify ownership ───────────────────
    const { data: record, error: fetchError } = await supabaseAdmin
      .from('medical_records')
      .select('id, patient_id, file_path, original_file_type, document_name, processing_status')
      .eq('id', recordId)
      .single();

    if (fetchError || !record) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (record.patient_id !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    if (!record.file_path) {
      return res.status(400).json({ success: false, error: 'Document has no associated file.' });
    }

    // ── 2. Skip if already completed (unless forced retry) ─────
    const forceRetry = req.body?.force === true;
    if (record.processing_status === 'completed' && !forceRetry) {
      // Return existing OCR result
      const { data: existing } = await supabaseAdmin
        .from('extracted_data')
        .select('extracted_text, created_at')
        .eq('record_id', recordId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return res.json({
        success:     true,
        cached:      true,
        recordId,
        extractedText: existing?.extracted_text || '',
      });
    }

    // ── 3. Mark as processing ──────────────────────────────────
    await supabaseAdmin
      .from('medical_records')
      .update({ processing_status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', recordId);

    // ── 4. Download file from Supabase Storage ─────────────────
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('medical-documents')
      .download(record.file_path);

    if (downloadError || !fileData) {
      await supabaseAdmin
        .from('medical_records')
        .update({ processing_status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', recordId);

      return res.status(502).json({
        success: false,
        error: 'Could not retrieve the document from storage.',
      });
    }

    // Convert Blob → Buffer
    const arrayBuffer = await fileData.arrayBuffer();
    const fileBuffer  = Buffer.from(arrayBuffer);
    const mimeType    = record.original_file_type || 'image/jpeg';
    const fileName    = record.file_path.split('/').pop() || 'document';

    // ── 5. Run OCR ─────────────────────────────────────────────
    const ocrResult = await runOcr({ fileBuffer, mimeType, fileName, engine });

    if (!ocrResult.success) {
      await supabaseAdmin
        .from('medical_records')
        .update({ processing_status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', recordId);

      return res.status(422).json({ success: false, error: ocrResult.error });
    }

    // ── 6. Save OCR result to extracted_data ───────────────────
    // Upsert: replace any previous extraction for this record
    const { error: upsertError } = await supabaseAdmin
      .from('extracted_data')
      .upsert(
        {
          record_id:      recordId,
          extracted_text: ocrResult.text,
          structured_data: {
            engine:   ocrResult.engine,
            pages:    ocrResult.pages,
            source:   'ocr.space',
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'record_id' }
      );

    if (upsertError) {
      console.error('[OCR route] extracted_data upsert failed:', upsertError.message);
      // OCR succeeded but save failed — still mark completed and return text
    }

    // ── 7. Update processing status ────────────────────────────
    await supabaseAdmin
      .from('medical_records')
      .update({ processing_status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', recordId);

    return res.json({
      success:       true,
      cached:        false,
      recordId,
      extractedText: ocrResult.text,
      engine:        ocrResult.engine,
      pages:         ocrResult.pages,
    });

  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/ocr/result/:recordId
 * Returns saved OCR result for a document.
 * Verifies ownership before returning.
 */
router.get('/result/:recordId', async (req, res, next) => {
  const { recordId } = req.params;
  const userId = req.user.id;

  try {
    // Verify ownership
    const { data: record, error: recErr } = await supabaseAdmin
      .from('medical_records')
      .select('id, patient_id, processing_status')
      .eq('id', recordId)
      .single();

    if (recErr || !record) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (record.patient_id !== userId) {
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    // Fetch saved extraction
    const { data: extraction, error: extErr } = await supabaseAdmin
      .from('extracted_data')
      .select('extracted_text, structured_data, created_at')
      .eq('record_id', recordId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return res.json({
      success:         true,
      recordId,
      processingStatus: record.processing_status,
      extractedText:   extraction?.extracted_text || null,
      meta:            extraction?.structured_data || null,
      extractedAt:     extraction?.created_at || null,
    });

  } catch (e) {
    next(e);
  }
});

export default router;
