import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 *
 * Props:
 *   requiredRole — 'patient' | 'doctor' | undefined (any authenticated user)
 *   children     — the page component to render when access is granted
 *
 * Behaviour:
 *   - While auth state is resolving (page refresh): shows a full-screen spinner.
 *   - Not authenticated: redirects to /login, preserving the intended URL.
 *   - Wrong role: redirects to the user's own dashboard.
 *   - Correct role: renders children.
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  // Wait for Supabase to resolve the session on first load
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-main)',
      }}>
        <LoadingSpinner size="lg" label="Checking session…" />
      </div>
    );
  }

  // Not logged in → go to login, remember where they were trying to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → redirect to their own dashboard
  if (requiredRole && profile?.role !== requiredRole) {
    const redirect = profile?.role === 'doctor'
      ? '/doctor/dashboard'
      : '/patient/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
