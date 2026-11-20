import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  // loading is true ONLY while the initial session check runs on page load.
  // login() and register() do NOT touch this flag —
  // onAuthStateChange handles all state updates after the initial load.
  const [loading, setLoading] = useState(true);

  // ── Fetch profile row ─────────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // PGRST116 = row not found (trigger may not have run yet — retry once)
      if (error?.code === 'PGRST116') {
        await new Promise(r => setTimeout(r, 800));
        const retry = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setProfile(retry.data ?? null);
      } else if (error) {
        console.error('[AuthContext] fetchProfile:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('[AuthContext] fetchProfile exception:', e);
      setProfile(null);
    }
  }, []);

  // ── Single auth state listener ────────────────────────────────
  useEffect(() => {
    // Resolve existing session on page load / refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      fetchProfile(authUser?.id).finally(() => setLoading(false));
    });

    // React to every auth event going forward
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        await fetchProfile(authUser?.id);
        setLoading(false); // safe to call multiple times
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── register ──────────────────────────────────────────────────
  // Does NOT set loading — onAuthStateChange handles state updates
  const register = useCallback(async ({ full_name, email, password, role }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: full_name.trim(), role } },
      });

      if (error) return { success: false, error: error.message };

      // requiresConfirmation = true  → email confirmation is enabled
      // requiresConfirmation = false → user is logged in immediately
      return {
        success: true,
        requiresConfirmation: !data.session,
        role,
        data,
      };
    } catch (e) {
      return { success: false, error: e.message || 'Registration failed.' };
    }
  }, []);

  // ── login ─────────────────────────────────────────────────────
  // Does NOT set loading — onAuthStateChange handles state updates
  const login = useCallback(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e.message || 'Login failed.' };
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange fires SIGNED_OUT → clears user and profile
  }, []);

  // ── refreshProfile ────────────────────────────────────────────
  const refreshProfile = useCallback(() => {
    return fetchProfile(user?.id);
  }, [fetchProfile, user?.id]);

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAuthenticated: !!user,
      register, login, logout, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
