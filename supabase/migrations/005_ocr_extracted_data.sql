-- ============================================================
-- MIGRATION 005 — OCR support changes to extracted_data
-- Run in Supabase SQL Editor AFTER migrations 001-004.
-- ============================================================

-- ── 1. Add a unique constraint on record_id ───────────────────
-- The backend upserts OCR results using ON CONFLICT (record_id).
-- Without this constraint the upsert falls back to insert and
-- creates duplicate rows.
ALTER TABLE public.extracted_data
  ADD CONSTRAINT extracted_data_record_id_unique UNIQUE (record_id);

-- ── 2. Add ocr_engine column to track which engine was used ───
ALTER TABLE public.extracted_data
  ADD COLUMN IF NOT EXISTS ocr_engine INTEGER;

-- ── 3. Add ocr_error column for failed processing details ─────
ALTER TABLE public.extracted_data
  ADD COLUMN IF NOT EXISTS ocr_error TEXT;

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running you should see in Table Editor → extracted_data:
--   • A UNIQUE constraint on record_id
--   • New columns: ocr_engine (integer), ocr_error (text)
-- No existing rows are affected.
