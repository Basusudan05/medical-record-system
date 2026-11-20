import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * ConfirmDialog
 * Modal confirmation for destructive actions.
 *
 * Props:
 *   title      — heading
 *   message    — body text
 *   confirmLabel — confirm button label (default 'Delete')
 *   onConfirm  — called on confirm
 *   onCancel   — called on cancel / backdrop click
 *   loading    — disable buttons while async action runs
 */
export default function ConfirmDialog({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="confirm-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="confirm-dialog__icon">
          <AlertTriangle size={22} />
        </div>
        <h3 className="confirm-dialog__title">{title}</h3>
        {message && <p className="confirm-dialog__message">{message}</p>}
        <div className="confirm-dialog__actions">
          <button
            className="confirm-dialog__btn confirm-dialog__btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="confirm-dialog__btn confirm-dialog__btn--confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
