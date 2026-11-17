-- ============================================================
-- MIGRATION 001 — profiles table
-- Run this FIRST in Supabase SQL Editor
-- ============================================================

-- ── 1. profiles table ────────────────────────────────────────
-- Stores public user information linked to Supabase Auth users.
-- One row per user. Created automatically after registration.

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL DEFAULT '',
  email           TEXT NOT NULL DEFAULT '',
  role            TEXT NOT NULL DEFAULT 'patient'
                    CHECK (role IN ('patient', 'doctor')),
  phone           TEXT,
  date_of_birth   DATE,
  blood_group     TEXT,
  address         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Index on role (used for role-based queries) ───────────
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ── 3. Auto-update updated_at on row change ──────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── 4. Auto-create profile row on new Supabase Auth user ─────
-- Triggered by Supabase Auth when a user registers.
-- Reads full_name and role from user metadata set during signup.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5. Enable Row Level Security ─────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── VERIFICATION ─────────────────────────────────────────────
-- After running, you should see:
--   • Table "profiles" under Table Editor
--   • RLS enabled (shown in Table Editor > RLS column)
--   • Two policies in Authentication > Policies > profiles
--   • Trigger "trg_on_auth_user_created" under Database > Triggers
