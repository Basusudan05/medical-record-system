import { QrCode, Shield, Clock, X } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MOCK_RECORDS } from '../../data/mockData';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import './ShareRecordsPage.css';

// One synthetic active share for the UI demo
const ACTIVE_SHARES = [
  {
    id: 'qr_001',
    created: '2026-11-06',
    expires: '2026-11-13',
    records: 2,
    status: 'active',
    accessed_by: 'Dr. Priya Kapoor',
  },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function ShareRecordsPage() {
  return (
    <AppLayout role="patient" title="Share Records">
      <div className="share">
        <div className="share__header">
          <h2 className="share__title">Share medical records</h2>
          <p className="share__subtitle">
            Select specific records and generate a time-limited QR code for a doctor to scan.
            You control exactly which records are visible and can revoke access at any time.
          </p>
        </div>

        <div className="share__layout">
          {/* Left — select records */}
          <div>
            <section className="share__card">
              <h3 className="share__card-title">Step 1 · Select records to share</h3>
              <div className="share__record-list">
                {MOCK_RECORDS.map(rec => (
                  <label key={rec.id} className="share__record-item">
                    <input type="checkbox" className="share__checkbox" />
                    <div className="share__record-info">
                      <span className="share__record-name">{rec.document_name}</span>
                      <span className="share__record-meta">
                        <DocTypeBadge type={rec.document_type} />
                        <span className="share__record-date">{formatDate(rec.upload_date)}</span>
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            <section className="share__card" style={{ marginTop: 'var(--space-5)' }}>
              <h3 className="share__card-title">Step 2 · Configure access</h3>
              <div className="share__config">
                <div className="share__config-field">
                  <label className="share__config-label">
                    <Clock size={13} />
                    Access expires after
                  </label>
                  <select className="share__config-select">
                    <option>24 hours</option>
                    <option>3 days</option>
                    <option>7 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>

              <div className="share__generate-area">
                <div className="share__generate-note">
                  <QrCode size={14} />
                  <span>QR code generation available in Phase 9</span>
                </div>
                <button className="share__generate-btn" disabled>
                  <QrCode size={15} />
                  Generate QR code
                </button>
              </div>
            </section>
          </div>

          {/* Right — active shares + security */}
          <div>
            <section className="share__card">
              <h3 className="share__card-title">Active shares</h3>
              {ACTIVE_SHARES.map(s => (
                <div key={s.id} className="share__active-item">
                  <div className="share__active-left">
                    <div className="share__active-icon">
                      <QrCode size={16} />
                    </div>
                    <div>
                      <div className="share__active-title">
                        {s.records} record{s.records !== 1 ? 's' : ''} shared
                      </div>
                      <div className="share__active-meta">
                        Created {formatDate(s.created)} ·
                        Expires {formatDate(s.expires)}
                      </div>
                      {s.accessed_by && (
                        <div className="share__active-accessed">
                          Accessed by {s.accessed_by}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="share__revoke-btn" title="Revoke access">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </section>

            <section className="share__card share__security-card">
              <div className="share__security-icon">
                <Shield size={18} />
              </div>
              <h3 className="share__security-title">How QR sharing works</h3>
              <ul className="share__security-list">
                {[
                  'You choose exactly which records are shared.',
                  'A cryptographically secure token is generated — not a database ID.',
                  'Tokens expire automatically on the date you set.',
                  'You can revoke any share at any time.',
                  'Every access is logged with a timestamp.',
                ].map(point => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
