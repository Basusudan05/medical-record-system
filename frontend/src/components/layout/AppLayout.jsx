import { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import DoctorSidebar from './DoctorSidebar';
import Header from './Header';
import { MOCK_USER } from '../../data/mockData';
import './AppLayout.css';

/**
 * AppLayout
 * Shell for every authenticated page.
 *
 * Props:
 *   role     — 'patient' | 'doctor'
 *   title    — current page title
 *   children — page content
 */
export default function AppLayout({ role = 'patient', title = '', children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Sidebar = role === 'doctor' ? DoctorSidebar : PatientSidebar;

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-layout__main">
        <Header
          title={title}
          user={MOCK_USER}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="app-layout__content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
