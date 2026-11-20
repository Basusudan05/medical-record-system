-- ============================================================
-- MIGRATION 004 — Supabase Storage bucket + policies
-- Run this in Supabase SQL Editor AFTER migrations 001-003.
-- ============================================================

-- ── 1. Create the private storage bucket ─────────────────────
-- If the bucket already exists this is a no-op.
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-documents', 'medical-documents', false)
ON CONFLICT (id) DO NOTHING;

-- ── 2. Storage RLS policies ───────────────────────────────────
-- Users can upload files only inside their own user-id folder.
CREATE POLICY "storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'medical-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own files only.
CREATE POLICY "storage_select_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'medical-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own files only.
CREATE POLICY "storage_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'medical-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── 3. Add file_size_bytes to medical_records ─────────────────
-- The existing column is file_size_kb (integer).
-- We add a bytes column for more precision. Both are kept.
ALTER TABLE public.medical_records
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running you should see:
--   • Bucket "medical-documents" in Storage → Buckets (not public)
--   • 3 storage policies in Storage → Policies
--   • Column file_size_bytes in Table Editor → medical_records
