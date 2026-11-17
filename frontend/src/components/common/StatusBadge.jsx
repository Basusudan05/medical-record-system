import './StatusBadge.css';

/**
 * StatusBadge
 * Props:
 *   status — 'verified' | 'pending' | 'needs_review' | 'completed' | 'processing' | 'failed'
 *   label  — override display text (optional)
 */
const STATUS_MAP = {
  verified:    { label: 'Verified',    cls: 'badge--success' },
  pending:     { label: 'Pending',     cls: 'badge--warning' },
  needs_review:{ label: 'Needs Review',cls: 'badge--warning' },
  completed:   { label: 'Completed',   cls: 'badge--success' },
  processing:  { label: 'Processing',  cls: 'badge--info' },
  failed:      { label: 'Failed',      cls: 'badge--error' },
  normal:      { label: 'Normal',      cls: 'badge--success' },
  low:         { label: 'Low',         cls: 'badge--warning' },
  high:        { label: 'High',        cls: 'badge--error' },
};

export default function StatusBadge({ status, label }) {
  const config = STATUS_MAP[status] || { label: status, cls: 'badge--neutral' };
  return (
    <span className={`status-badge ${config.cls}`}>
      {label || config.label}
    </span>
  );
}
