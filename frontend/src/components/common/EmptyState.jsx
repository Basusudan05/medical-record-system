import { FolderOpen } from 'lucide-react';
import './EmptyState.css';

/**
 * EmptyState
 * Props:
 *   icon    — Lucide icon component (optional, defaults to FolderOpen)
 *   title   — heading text
 *   message — supporting text
 *   action  — { label, onClick } optional CTA
 */
export default function EmptyState({ icon: Icon = FolderOpen, title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={40} />
      </div>
      {title && <h3 className="empty-state__title">{title}</h3>}
      {message && <p className="empty-state__message">{message}</p>}
      {action && (
        <button className="btn btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
