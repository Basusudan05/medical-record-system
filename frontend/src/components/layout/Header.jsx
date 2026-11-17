import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import './Header.css';

/**
 * Header
 * Props:
 *   title       — current page title
 *   user        — { full_name, role }
 *   onMenuClick — opens mobile sidebar
 */
export default function Header({ title = '', user = null, onMenuClick }) {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__left">
        {/* Mobile hamburger */}
        <button
          className="app-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <h1 className="app-header__title">{title}</h1>
      </div>

      <div className="app-header__right">
        {/* Search */}
        <div className="app-header__search">
          <Search size={14} className="app-header__search-icon" />
          <input
            type="search"
            placeholder="Search records…"
            className="app-header__search-input"
            aria-label="Search records"
          />
        </div>

        {/* Notifications */}
        <button className="app-header__icon-btn" aria-label="Notifications">
          <Bell size={17} />
        </button>

        {/* Profile */}
        <button className="app-header__profile" aria-label="Profile menu">
          <div className="app-header__avatar">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="app-header__name">{user?.full_name || 'Account'}</span>
          <ChevronDown size={13} />
        </button>
      </div>
    </header>
  );
}
