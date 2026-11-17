-- ============================================================
-- MIGRATION 002 — medical_records + extracted_data tables
-- Run this SECOND, after 001_profiles.sql succeeds
-- ============================================================

-- ── 1. medical_records table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.medical_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_name       TEXT NOT NULL,
  document_type       TEXT NOT NULL
                        CHECK (document_type IN (
                          'prescription', 'blood_report', 'xray', 'discharge', 'other'
                        )),
  file_path           TEXT,                    -- Supabase Storage path (Phase 4)
  original_file_type  TEXT,                    -- MIME type e.g. image/jpeg
  file_size_kb        INTEGER,
  doctor_name         TEXT,
  hospital            TEXT,
  notes               TEXT,
  upload_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  processing_status   TEXT NOT NULL DEFAULT 'pending'
                        CHECK (processing_status IN (
                          'pending', 'processing', 'completed', 'failed'
                        )),
  verification_status TEXT NOT NULL DEFAULT 'pending'
                        CHECK (verification_status IN (
                          'pending', 'needs_review', 'verified'
                        )),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. extracted_data table ──────────────────────────────────
-- Stores AI-extracted content separately from the original document.
CREATE TABLE IF NOT EXISTS public.extracted_data (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id           UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  extracted_text      TEXT,                    -- Raw OCR output
  structured_data     JSONB,                   -- Parsed medicines / test values
  ai_summary          TEXT,                    -- Plain-language explanation
  confidence_info     JSONB,                   -- Per-field confidence scores
  verified_data       JSONB,                   -- User-corrected version
  verified_at         TIMESTAMPTZ,
  verified_by         UUID REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id
  ON public.medical_records(patient_id);

CREATE INDEX IF NOT EXISTS idx_medical_records_upload_date
  ON public.medical_records(upload_date DESC);

CREATE INDEX IF NOT EXISTS idx_medical_records_document_type
  ON public.medical_records(document_type);

CREATE INDEX IF NOT EXISTS idx_extracted_data_record_id
  ON public.extracted_data(record_id);

-- ── 4. Auto-update updated_at triggers ──────────────────────
CREATE TRIGGER trg_medical_records_updated_at
  BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_extracted_data_updated_at
  BEFORE UPDATE ON public.extracted_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── 5. Row Level Security ────────────────────────────────────
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_data  ENABLE ROW LEVEL SECURITY;

-- Patients can only read/write their own records
CREATE POLICY "records_select_own"
  ON public.medical_records FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "records_insert_own"
  ON public.medical_records FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "records_update_own"
  ON public.medical_records FOR UPDATE
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "records_delete_own"
  ON public.medical_records FOR DELETE
  USING (auth.uid() = patient_id);

-- Extracted data is accessible if the user owns the linked record
CREATE POLICY "extracted_select_own"
  ON public.extracted_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_records r
      WHERE r.id = extracted_data.record_id
        AND r.patient_id = auth.uid()
    )
  );

CREATE POLICY "extracted_insert_own"
  ON public.extracted_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.medical_records r
      WHERE r.id = extracted_data.record_id
        AND r.patient_id = auth.uid()
    )
  );

CREATE POLICY "extracted_update_own"
  ON public.extracted_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.medical_records r
      WHERE r.id = extracted_data.record_id
        AND r.patient_id = auth.uid()
    )
  );

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running, you should see:
--   • Tables "medical_records" and "extracted_data" in Table Editor
--   • RLS enabled on both tables
--   • 4 policies on medical_records, 3 on extracted_data
