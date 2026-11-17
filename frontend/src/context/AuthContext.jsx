import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * AuthContext
 * Single source of truth for authentication state across the app.
 *
 * Provides:
 *   user            — Supabase Auth user object (or null)
 *   profile         — profiles table row (or null)
 *   loading         — true while session is being resolved on first load
 *   error           — last auth error message (or null)
 *   isAuthenticated — boolean shorthand
 *   register()      — sign up with email + password + metadata
 *   login()         — sign in with email + password
 *   logout()        — sign out and clear state
 *   refreshProfile()— re-fetch profile from database
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true until initial session resolved
  const [error, setError]     = useState(null);

  // ── Fetch profile row from public.profiles ──────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); return; }
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (err) {
        console.error('[AuthContext] fetchProfile error:', err.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (e) {
      console.error('[AuthContext] fetchProfile exception:', e);
      setProfile(null);
    }
  }, []);

  // ── Listen to Supabase Auth state changes ───────────────────
  useEffect(() => {
    // Get initial session (handles page refresh / tab reopen)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      fetchProfile(authUser?.id).finally(() => setLoading(false));
    });

    // Subscribe to future auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        await fetchProfile(authUser?.id);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── register ────────────────────────────────────────────────
  const register = useCallback(async ({ full_name, email, password, role }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: full_name.trim(), role }, // stored in raw_user_meta_data
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return { success: false, error: signUpError.message };
      }

      // Profile row is created by the database trigger (handle_new_user).
      // If the user is immediately confirmed (no email verification),
      // fetch the profile now. Otherwise wait for onAuthStateChange.
      if (data.user && data.session) {
        await fetchProfile(data.user.id);
      }

      return { success: true, data };
    } catch (e) {
      const msg = e.message || 'Registration failed.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // ── login ───────────────────────────────────────────────────
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      await fetchProfile(data.user.id);
      return { success: true, data };
    } catch (e) {
      const msg = e.message || 'Login failed.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // ── logout ──────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setError(null);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  // ── refreshProfile ───────────────────────────────────────────
  const refreshProfile = useCallback(() => {
    return fetchProfile(user?.id);
  }, [fetchProfile, user?.id]);

  const value = {
    user,
    profile,
    loading,
    error,
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

/**
 * useAuth — consume AuthContext in any component.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
