import './LoadingSpinner.css';

/**
 * LoadingSpinner
 * Props:
 *   size  — 'sm' | 'md' (default) | 'lg'
 *   label — accessible text (default 'Loading…')
 */
export default function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <div className="spinner__ring" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
