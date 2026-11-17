import { FileText, Droplets, Scan, FileOutput, File } from 'lucide-react';
import { DOCUMENT_TYPES } from '../../data/mockData';
import './DocTypeBadge.css';

const ICONS = {
  prescription: FileText,
  blood_report: Droplets,
  xray:         Scan,
  discharge:    FileOutput,
  other:        File,
};

/**
 * DocTypeBadge
 * Props:
 *   type — keyof DOCUMENT_TYPES
 */
export default function DocTypeBadge({ type }) {
  const cfg = DOCUMENT_TYPES[type] || DOCUMENT_TYPES.other;
  const Icon = ICONS[type] || File;
  return (
    <span
      className="doc-type-badge"
      style={{ '--badge-color': cfg.color, '--badge-bg': cfg.bg }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}
