import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * PublicOnlyRoute
 * Redirects already-authenticated users away from login / register.
 * Routes them to their role-appropriate dashboard.
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) {
    return (
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
  }

  if (isAuthenticated) {
    const dest = profile?.role === 'doctor'
      ? '/doctor/dashboard'
      : '/patient/dashboard';
    return <Navigate to={dest} replace />;
  }

  return children;
}
