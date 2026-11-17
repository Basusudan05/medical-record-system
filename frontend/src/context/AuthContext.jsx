import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  // loading = true only while the INITIAL session check on page load is running.
  // It is NOT toggled during login/register — the onAuthStateChange listener
  // handles all state updates after that.
  const [loading, setLoading] = useState(true);

  // ── Fetch profile from public.profiles ───────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // PGRST116 = no row found (profile trigger may not have run yet)
        if (error.code !== 'PGRST116') {
          console.error('[AuthContext] fetchProfile:', error.message);
        }
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('[AuthContext] fetchProfile exception:', e);
      setProfile(null);
    }
  }, []);

  // ── Single auth state listener (handles ALL auth events) ─────
  useEffect(() => {
    // 1. Resolve the session that already exists (page refresh, tab reopen)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      // fetchProfile resolves then we clear the initial loading flag exactly once
      fetchProfile(authUser?.id).finally(() => setLoading(false));
    });

    // 2. React to every future auth change (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED…)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        await fetchProfile(authUser?.id);
        // After the initial load, loading is already false.
        // We still call setLoading(false) here to cover the edge case where
        // onAuthStateChange fires before getSession resolves.
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── register ─────────────────────────────────────────────────
  // Does NOT touch loading state — onAuthStateChange handles it.
  const register = useCallback(async ({ full_name, email, password, role }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: full_name.trim(), role },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // data.session is null  → email confirmation required
      // data.session is set   → auto-confirmed, user is logged in immediately
      return { success: true, requiresConfirmation: !data.session, data };
    } catch (e) {
      return { success: false, error: e.message || 'Registration failed.' };
    }
  }, []);

  // ── login ────────────────────────────────────────────────────
  // Does NOT touch loading state — onAuthStateChange handles it.
  const login = useCallback(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (e) {
      return { success: false, error: e.message || 'Login failed.' };
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange will fire SIGNED_OUT and clear user/profile
  }, []);

  // ── refreshProfile ────────────────────────────────────────────
  const refreshProfile = useCallback(() => {
    return fetchProfile(user?.id);
  }, [fetchProfile, user?.id]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
