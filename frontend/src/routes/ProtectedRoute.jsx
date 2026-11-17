import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 * Guards routes that require authentication.
 *
 * Task 2 development mode:
 *   DEV_BYPASS = true  → all protected routes render directly (no redirect)
 *   This flag is flipped to false in Phase 3 when real auth context is wired.
 *
 * Phase 3: replace DEV_BYPASS + mock values with:
 *   const { isAuthenticated, user } = useAuth();
 */
const DEV_BYPASS = true; // ← flip to false when auth context is ready (Phase 3)

export default function ProtectedRoute({ requiredRole, children }) {
  if (DEV_BYPASS) return children;

  // Real auth — wired in Phase 3
  const isAuthenticated = false;
  const userRole = null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />;
  }

  return children;
}
