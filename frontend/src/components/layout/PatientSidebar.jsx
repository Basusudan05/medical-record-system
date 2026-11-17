import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Upload, ClipboardList,
  Bot, QrCode, User, Settings, Activity, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/patient/upload',    icon: Upload,           label: 'Upload / Scan' },
  { to: '/patient/history',   icon: ClipboardList,    label: 'Medical History' },
  { to: '/patient/assistant', icon: Bot,              label: 'AI Assistant' },
  { to: '/patient/share',     icon: QrCode,           label: 'Share Records' },
];

const BOTTOM_ITEMS = [
  { to: '/patient/profile',  icon: User,     label: 'Profile' },
  { to: '/patient/settings', icon: Settings, label: 'Settings' },
];

export default function PatientSidebar({ isOpen, onClose }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    onClose?.();
    await logout();
    navigate('/', { replace: true });
  }

  const initials = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : '?';

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
        aria-label="Patient navigation"
      >
        {/* Logo */}
        <div className="sidebar__logo">
          <Activity size={20} className="sidebar__logo-icon" />
          <span className="sidebar__logo-text">MediVault</span>
        </div>

        {/* Main nav */}
        <nav className="sidebar__nav" aria-label="Main navigation">
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

          <span className="sidebar__section-label" style={{ marginTop: 'var(--space-4)' }}>
            Account
          </span>
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

        {/* User + logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user" onClick={handleLogout} title="Sign out">
            <div className="sidebar__user-avatar">{initials}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">
                {profile?.full_name || 'Patient'}
              </div>
              <div className="sidebar__user-role">Patient · Sign out</div>
            </div>
            <LogOut size={15} style={{ color: '#475569', flexShrink: 0 }} />
          </div>
        </div>
      </aside>
    </>
  );
}
