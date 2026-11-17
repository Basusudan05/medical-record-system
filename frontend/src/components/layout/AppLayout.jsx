import { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import DoctorSidebar from './DoctorSidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import './AppLayout.css';

/**
 * AppLayout
 * Shell for every authenticated page.
 *
 * Props:
 *   role     — 'patient' | 'doctor'  (passed by each page)
 *   title    — current page title shown in the header
 *   children — page content
 *
 * User data comes from AuthContext — no more MOCK_USER.
 */
export default function AppLayout({ role = 'patient', title = '', children }) {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = role === 'doctor' ? DoctorSidebar : PatientSidebar;

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
      <div className="app-layout__main">
        <Header
          title={title}
          user={profile}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="app-layout__content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
