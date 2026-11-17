import { NavLink } from 'react-router-dom';
import { LayoutDashboard, QrCode, FolderOpen, User, LogOut, Activity } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/doctor/scan',      icon: QrCode,          label: 'Scan QR Code' },
  { to: '/doctor/records',   icon: FolderOpen,      label: 'Patient Records' },
];

const BOTTOM_ITEMS = [
  { to: '/doctor/profile', icon: User, label: 'Profile' },
];

export default function DoctorSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 199 }}
        />
      )}

      <aside
        className={`sidebar${isOpen ? ' sidebar--open' : ''}`}
        aria-label="Doctor navigation"
      >
        <div className="sidebar__logo">
          <Activity size={20} className="sidebar__logo-icon" />
          <span className="sidebar__logo-text">MediVault</span>
        </div>

        <nav className="sidebar__nav" aria-label="Doctor navigation">
          <span className="sidebar__section-label">Navigation</span>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}

          <span className="sidebar__section-label" style={{ marginTop: 'var(--space-4)' }}>Account</span>
          {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">D</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">Demo Doctor</div>
              <div className="sidebar__user-role">Doctor</div>
            </div>
            <LogOut size={15} style={{ color: '#475569' }} />
          </div>
        </div>
      </aside>
    </>
  );
}
