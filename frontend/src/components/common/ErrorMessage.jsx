import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

/**
 * ErrorMessage
 * Props:
 *   message — string
 *   onRetry — optional callback
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-msg" role="alert">
      <AlertCircle size={20} className="error-msg__icon" />
      <span className="error-msg__text">{message || 'Something went wrong.'}</span>
      {onRetry && (
        <button className="error-msg__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
