import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import './Toast.css';

/**
 * Toast
 * Simple self-dismissing notification.
 *
 * Props:
 *   message  — string
 *   type     — 'success' | 'error' | 'info' (default 'info')
 *   onClose  — called when dismissed or after duration
 *   duration — ms before auto-dismiss (default 4000, 0 = no auto-dismiss)
 */
const ICONS = {
  success: CheckCircle,
  error:   AlertCircle,
  info:    Info,
};

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const Icon = ICONS[type] || Info;

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <Icon size={16} className="toast__icon" />
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
