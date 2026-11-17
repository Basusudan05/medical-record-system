-- ============================================================
-- MIGRATION 003 — QR sharing, record access, access logs
-- Run this THIRD, after 002_medical_records.sql succeeds
-- ============================================================

-- ── 1. qr_tokens table ───────────────────────────────────────
-- Each QR share generates one token with a list of record IDs.
CREATE TABLE IF NOT EXISTS public.qr_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL UNIQUE,        -- SHA-256 of the random token
  record_ids      UUID[] NOT NULL DEFAULT '{}', -- Records included in this share
  expires_at      TIMESTAMPTZ NOT NULL,
  revoked_at      TIMESTAMPTZ,                 -- NULL = still active
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. record_access table ───────────────────────────────────
-- Tracks which doctor accessed which patient records via QR.
CREATE TABLE IF NOT EXISTS public.record_access (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id       UUID REFERENCES public.profiles(id),
  record_id       UUID NOT NULL REFERENCES public.medical_records(id) ON DELETE CASCADE,
  qr_token_id     UUID REFERENCES public.qr_tokens(id),
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ
);

-- ── 3. access_logs table ─────────────────────────────────────
-- Immutable audit log — every view event is recorded.
CREATE TABLE IF NOT EXISTS public.access_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  qr_token_id     UUID REFERENCES public.qr_tokens(id),
  accessed_by     UUID REFERENCES public.profiles(id),
  record_id       UUID REFERENCES public.medical_records(id),
  action          TEXT NOT NULL
                    CHECK (action IN ('view', 'download', 'qr_scan', 'revoke')),
  ip_address      TEXT,
  accessed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_qr_tokens_patient_id
  ON public.qr_tokens(patient_id);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_token_hash
  ON public.qr_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires_at
  ON public.qr_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_record_access_patient_id
  ON public.record_access(patient_id);

CREATE INDEX IF NOT EXISTS idx_record_access_doctor_id
  ON public.record_access(doctor_id);

CREATE INDEX IF NOT EXISTS idx_access_logs_patient_id
  ON public.access_logs(patient_id);

CREATE INDEX IF NOT EXISTS idx_access_logs_qr_token_id
  ON public.access_logs(qr_token_id);

-- ── 5. Row Level Security ────────────────────────────────────
ALTER TABLE public.qr_tokens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.record_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs  ENABLE ROW LEVEL SECURITY;

-- Patients manage their own QR tokens
CREATE POLICY "qr_tokens_select_own"
  ON public.qr_tokens FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "qr_tokens_insert_own"
  ON public.qr_tokens FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "qr_tokens_update_own"
  ON public.qr_tokens FOR UPDATE
  USING (auth.uid() = patient_id);

-- Patients see access to their own records
CREATE POLICY "record_access_select_own"
  ON public.record_access FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Only the backend service role inserts access log entries
-- (access_logs is insert-only from the server; patients can read their own)
CREATE POLICY "access_logs_select_own"
  ON public.access_logs FOR SELECT
  USING (auth.uid() = patient_id);

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running, you should see:
--   • Tables: qr_tokens, record_access, access_logs in Table Editor
--   • RLS enabled on all three tables
--   • Policies visible under Authentication > Policies
