import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Upload, ClipboardList, QrCode,
  TrendingUp, ArrowRight, Clock, Eye,
  Activity,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../hooks/useDocuments';
import './PatientDashboard.css';

const QUICK_ACTIONS = [
  { label: 'Upload Document', icon: Upload,        to: '/patient/upload',    desc: 'Add a new record' },
  { label: 'Medical History', icon: ClipboardList, to: '/patient/history',   desc: 'Browse all records' },
  { label: 'Share Records',   icon: QrCode,        to: '/patient/share',     desc: 'Generate QR access' },
  { label: 'AI Assistant',    icon: Activity,      to: '/patient/assistant', desc: 'Ask about records' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const { documents, loading, fetchDocuments } = useDocuments();

  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user?.id, fetchDocuments]);

  const firstName   = profile?.full_name?.split(' ')[0] || 'there';
  const recentDocs  = documents.slice(0, 5);

  // Compute stats from real data
  const stats = {
    total:         documents.length,
    prescriptions: documents.filter(d => d.document_type === 'prescription').length,
    reports:       documents.filter(d => d.document_type !== 'prescription').length,
    shared:        0, // Phase 9
  };

  return (
    <AppLayout role="patient" title="Overview">
      <div className="pd">
        {/* Welcome */}
        <div className="pd__welcome">
          <div>
            <h2 className="pd__greeting">{getGreeting()}, {firstName}</h2>
            <p className="pd__welcome-sub">Here&rsquo;s a summary of your medical records.</p>
          </div>
          <Link to="/patient/upload" className="pd__upload-btn">
            <Upload size={15} />
            Upload document
          </Link>
        </div>

        {/* Stats */}
        <div className="pd__stats">
          {[
            { label: 'Total Records',   value: loading ? '…' : stats.total,         icon: FileText,      color: 'blue' },
            { label: 'Prescriptions',   value: loading ? '…' : stats.prescriptions,  icon: ClipboardList, color: 'teal' },
            { label: 'Medical Reports', value: loading ? '…' : stats.reports,        icon: TrendingUp,    color: 'violet' },
            { label: 'Shared Records',  value: stats.shared,                          icon: QrCode,        color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`pd__stat-card pd__stat-card--${color}`}>
              <div className="pd__stat-icon"><Icon size={16} /></div>
              <div>
                <div className="pd__stat-value">{value}</div>
                <div className="pd__stat-label">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <section className="pd__section">
          <h3 className="pd__section-title">Quick actions</h3>
          <div className="pd__actions">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to, desc }) => (
              <Link key={to} to={to} className="pd__action-card">
                <div className="pd__action-icon"><Icon size={18} /></div>
                <div>
                  <div className="pd__action-label">{label}</div>
                  <div className="pd__action-desc">{desc}</div>
                </div>
                <ArrowRight size={15} className="pd__action-arrow" />
              </Link>
            ))}
          </div>
        </section>

        {/* Recent records */}
        <div className="pd__bottom">
          <section className="pd__section pd__section--card">
            <div className="pd__section-head">
              <h3 className="pd__section-title">Recent records</h3>
              <Link to="/patient/history" className="pd__section-link">
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
                <LoadingSpinner size="md" label="Loading records…" />
              </div>
            ) : recentDocs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No records yet"
                message="Upload your first medical document to get started."
              />
            ) : (
              <table className="pd__table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map(rec => (
                    <tr key={rec.id}>
                      <td>
                        <span className="pd__table-name">{rec.document_name}</span>
                      </td>
                      <td><DocTypeBadge type={rec.document_type} /></td>
                      <td className="pd__table-date">
                        <Clock size={12} />
                        {formatDate(rec.created_at)}
                      </td>
                      <td><StatusBadge status={rec.processing_status} /></td>
                      <td>
                        <Link to="/patient/history" className="pd__table-link">
                          <Eye size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
