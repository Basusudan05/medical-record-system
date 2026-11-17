import { Routes, Route, Navigate } from 'react-router-dom';

// Guards
import ProtectedRoute  from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';

// Public pages
import LandingPage   from '../pages/public/LandingPage';
import LoginPage     from '../pages/public/LoginPage';
import RegisterPage  from '../pages/public/RegisterPage';

// Patient pages
import PatientDashboard    from '../pages/patient/PatientDashboard';
import UploadPage          from '../pages/patient/UploadPage';
import MedicalHistoryPage  from '../pages/patient/MedicalHistoryPage';
import DocumentDetailsPage from '../pages/patient/DocumentDetailsPage';
import AIAssistantPage     from '../pages/patient/AIAssistantPage';
import ShareRecordsPage    from '../pages/patient/ShareRecordsPage';
import ProfilePage         from '../pages/patient/ProfilePage';

// Doctor pages
import DoctorDashboard       from '../pages/doctor/DoctorDashboard';
import ScanQRPage            from '../pages/doctor/ScanQRPage';
import AuthorizedRecordsPage from '../pages/doctor/AuthorizedRecordsPage';
import DoctorProfilePage     from '../pages/doctor/DoctorProfilePage';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public (always accessible) ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Auth pages (redirect to dashboard if already logged in) ── */}
      <Route path="/login"    element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      {/* ── Patient dashboard (requires patient role) ── */}
      <Route path="/patient/dashboard"   element={<ProtectedRoute requiredRole="patient"><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/upload"      element={<ProtectedRoute requiredRole="patient"><UploadPage /></ProtectedRoute>} />
      <Route path="/patient/history"     element={<ProtectedRoute requiredRole="patient"><MedicalHistoryPage /></ProtectedRoute>} />
      <Route path="/patient/records/:id" element={<ProtectedRoute requiredRole="patient"><DocumentDetailsPage /></ProtectedRoute>} />
      <Route path="/patient/assistant"   element={<ProtectedRoute requiredRole="patient"><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/patient/share"       element={<ProtectedRoute requiredRole="patient"><ShareRecordsPage /></ProtectedRoute>} />
      <Route path="/patient/profile"     element={<ProtectedRoute requiredRole="patient"><ProfilePage /></ProtectedRoute>} />
      <Route path="/patient/settings"    element={<ProtectedRoute requiredRole="patient"><ProfilePage /></ProtectedRoute>} />

      {/* ── Doctor dashboard (requires doctor role) ── */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/scan"      element={<ProtectedRoute requiredRole="doctor"><ScanQRPage /></ProtectedRoute>} />
      <Route path="/doctor/records"   element={<ProtectedRoute requiredRole="doctor"><AuthorizedRecordsPage /></ProtectedRoute>} />
      <Route path="/doctor/profile"   element={<ProtectedRoute requiredRole="doctor"><DoctorProfilePage /></ProtectedRoute>} />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
