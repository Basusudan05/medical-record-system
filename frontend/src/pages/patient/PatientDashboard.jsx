import { Link } from 'react-router-dom';
import {
  FileText, Upload, ClipboardList, QrCode,
  TrendingUp, ArrowRight, Clock, CheckCircle2,
  AlertCircle, Activity,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { MOCK_RECORDS, MOCK_STATS, MOCK_ACTIVITY, MOCK_USER } from '../../data/mockData';
import './PatientDashboard.css';

const QUICK_ACTIONS = [
  { label: 'Upload Document',  icon: Upload,       to: '/patient/upload',  desc: 'Add a new record' },
  { label: 'Medical History',  icon: ClipboardList, to: '/patient/history', desc: 'Browse all records' },
  { label: 'Share Records',    icon: QrCode,        to: '/patient/share',   desc: 'Generate QR access' },
  { label: 'AI Assistant',     icon: Activity,      to: '/patient/assistant', desc: 'Ask about records' },
];

const ACTIVITY_ICONS = {
  upload: Upload,
  ai: TrendingUp,
  verify: CheckCircle2,
  share: QrCode,
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function PatientDashboard() {
  const recentRecords = MOCK_RECORDS.slice(0, 5);
  const recentActivity = MOCK_ACTIVITY.slice(0, 5);

  return (
    <AppLayout role="patient" title="Overview">
      <div className="pd">
        {/* Welcome */}
        <div className="pd__welcome">
          <div>
            <h2 className="pd__greeting">
              {getGreeting()}, {MOCK_USER.full_name.split(' ')[0]}
            </h2>
            <p className="pd__welcome-sub">
              Here&rsquo;s a summary of your medical records.
            </p>
          </div>
          <Link to="/patient/upload" className="pd__upload-btn">
            <Upload size={15} />
            Upload document
          </Link>
        </div>

        {/* Stats */}
        <div className="pd__stats">
          {[
            { label: 'Total Records',    value: MOCK_STATS.total_records,   icon: FileText,      color: 'blue' },
            { label: 'Prescriptions',    value: MOCK_STATS.prescriptions,   icon: ClipboardList, color: 'teal' },
            { label: 'Medical Reports',  value: MOCK_STATS.medical_reports, icon: TrendingUp,    color: 'violet' },
            { label: 'Shared Records',   value: MOCK_STATS.shared_records,  icon: QrCode,        color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`pd__stat-card pd__stat-card--${color}`}>
              <div className="pd__stat-icon">
                <Icon size={16} />
              </div>
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
                <div className="pd__action-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="pd__action-label">{label}</div>
                  <div className="pd__action-desc">{desc}</div>
                </div>
                <ArrowRight size={15} className="pd__action-arrow" />
              </Link>
            ))}
          </div>
        </section>

        {/* Two-column: recent records + activity */}
        <div className="pd__bottom">
          {/* Recent records table */}
          <section className="pd__section pd__section--card">
            <div className="pd__section-head">
              <h3 className="pd__section-title">Recent records</h3>
              <Link to="/patient/history" className="pd__section-link">
                View all <ArrowRight size={13} />
              </Link>
            </div>
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
                {recentRecords.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <span className="pd__table-name">{rec.document_name}</span>
                      <span className="pd__table-hospital">{rec.hospital}</span>
                    </td>
                    <td><DocTypeBadge type={rec.document_type} /></td>
                    <td className="pd__table-date">
                      <Clock size={12} />
                      {formatDate(rec.upload_date)}
                    </td>
                    <td><StatusBadge status={rec.verification_status} /></td>
                    <td>
                      <Link to={`/patient/records/${rec.id}`} className="pd__table-link">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Activity feed */}
          <section className="pd__section pd__section--card">
            <div className="pd__section-head">
              <h3 className="pd__section-title">Recent activity</h3>
            </div>
            <div className="pd__activity">
              {recentActivity.map(item => {
                const Icon = ACTIVITY_ICONS[item.type] || AlertCircle;
                return (
                  <div key={item.id} className="pd__activity-item">
                    <div className="pd__activity-icon">
                      <Icon size={14} />
                    </div>
                    <div className="pd__activity-body">
                      <span className="pd__activity-msg">{item.message}</span>
                      <span className="pd__activity-time">
                        {formatDate(item.time)} · {formatTime(item.time)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
