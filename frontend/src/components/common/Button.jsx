import LoadingSpinner from './LoadingSpinner';
import './Button.css';

/**
 * Button
 * Props:
 *   variant  — 'primary' | 'secondary' | 'ghost' | 'danger' (default: 'primary')
 *   size     — 'sm' | 'md' (default) | 'lg'
 *   loading  — boolean
 *   disabled — boolean
 *   icon     — Lucide icon component (placed before label)
 *   onClick  — handler
 *   type     — button type (default: 'button')
 *   children — label
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <LoadingSpinner size="sm" label="Loading" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 16} />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
