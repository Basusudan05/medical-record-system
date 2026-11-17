import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * ProtectedRoute
 *
 * Guards:
 *   1. loading=true → spinner (initial page load / session resolution)
 *   2. not authenticated → redirect to /login
 *   3. authenticated but profile still loading → spinner (profile fetch in progress)
 *   4. wrong role → redirect to correct dashboard
 *   5. correct → render children
 */
export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  const spinner = (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-main)',
    }}>
      <LoadingSpinner size="lg" label="Loading…" />
    </div>
  );

  // 1. Initial session resolution
  if (loading) return spinner;

  // 2. Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in but profile row hasn't been fetched yet
  //    (can happen for ~100ms after a fresh registration)
  if (requiredRole && !profile) return spinner;

  // 4. Wrong role
  if (requiredRole && profile.role !== requiredRole) {
    const redirect = profile.role === 'doctor'
      ? '/doctor/dashboard'
      : '/patient/dashboard';
    return <Navigate to={redirect} replace />;
  }

  // 5. Authorised
  return children;
}
