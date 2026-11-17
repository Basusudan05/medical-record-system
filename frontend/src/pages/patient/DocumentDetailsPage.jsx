import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Calendar, Building2,
  User, AlertCircle, CheckCircle2, Clock, QrCode,
  Download, ExternalLink,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { MOCK_RECORDS } from '../../data/mockData';
import './DocumentDetailsPage.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const record = MOCK_RECORDS.find(r => r.id === id);

  if (!record) {
    return (
      <AppLayout role="patient" title="Record Details">
        <EmptyState
          icon={FileText}
          title="Record not found"
          message="This medical record does not exist or has been removed."
          action={{ label: 'Back to history', onClick: () => window.history.back() }}
        />
      </AppLayout>
    );
  }

  const isPrescription = record.document_type === 'prescription';
  const isBloodReport = record.document_type === 'blood_report';

  return (
    <AppLayout role="patient" title="Record Details">
      <div className="dd">
        {/* Back */}
        <Link to="/patient/history" className="dd__back">
          <ArrowLeft size={15} />
          Back to Medical History
        </Link>

        {/* Page header */}
        <div className="dd__header">
          <div className="dd__header-left">
            <div className="dd__header-icon">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="dd__title">{record.document_name}</h2>
              <div className="dd__header-meta">
                <DocTypeBadge type={record.document_type} />
                <StatusBadge status={record.verification_status} />
                <span className="dd__meta-date">
                  <Calendar size={12} />
                  {formatDate(record.upload_date)}
                </span>
              </div>
            </div>
          </div>
          <div className="dd__header-actions">
            <button className="dd__btn-ghost">
              <Download size={15} />
              Download
            </button>
            <button className="dd__btn-ghost">
              <ExternalLink size={15} />
              Open original
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="dd__layout">
          {/* Left — document preview */}
          <div className="dd__col-left">
            {/* Document preview */}
            <section className="dd__card">
              <h3 className="dd__card-title">Document preview</h3>
              <div className="dd__preview-placeholder">
                <div className="dd__preview-placeholder-inner">
                  <FileText size={36} />
                  <p>Original document preview</p>
                  <p className="dd__preview-note">
                    Secure document viewer available after Supabase Storage integration (Phase 4).
                  </p>
                </div>
              </div>
            </section>

            {/* Document info */}
            <section className="dd__card">
              <h3 className="dd__card-title">Document information</h3>
              <div className="dd__info-grid">
                <div className="dd__info-item">
                  <span className="dd__info-label">Doctor</span>
                  <span className="dd__info-value">
                    <User size={13} />
                    {record.doctor_name}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">Hospital / Lab</span>
                  <span className="dd__info-value">
                    <Building2 size={13} />
                    {record.hospital}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">Upload date</span>
                  <span className="dd__info-value">
                    <Clock size={13} />
                    {formatDate(record.upload_date)}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">File type</span>
                  <span className="dd__info-value">
                    {record.file_type.split('/')[1].toUpperCase()} · {record.size_kb} KB
                  </span>
                </div>
                {record.notes && (
                  <div className="dd__info-item dd__info-item--full">
                    <span className="dd__info-label">Notes</span>
                    <span className="dd__info-value">{record.notes}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right — AI extracted data */}
          <div className="dd__col-right">
            {/* AI extraction */}
            <section className="dd__card">
              <div className="dd__card-head">
                <h3 className="dd__card-title">AI extracted information</h3>
                <StatusBadge status={record.processing_status} />
              </div>

              <div className="dd__ai-notice">
                <AlertCircle size={14} />
                <span>
                  AI-extracted data requires verification before use. Uncertain fields are highlighted.
                  Full AI processing available in Phase 5.
                </span>
              </div>

              {isPrescription && record.extracted?.medicines ? (
                <div className="dd__prescription">
                  {record.extracted.diagnosis && (
                    <div className="dd__diagnosis">
                      <span className="dd__diagnosis-label">Diagnosis</span>
                      <span className="dd__diagnosis-value">{record.extracted.diagnosis}</span>
                    </div>
                  )}
                  <div className="dd__meds-label">Medicines</div>
                  {record.extracted.medicines.map((med, i) => (
                    <div
                      key={i}
                      className={`dd__med-card${med.confidence === 'needs_review' ? ' dd__med-card--review' : ''}`}
                    >
                      <div className="dd__med-header">
                        <span className="dd__med-name">{med.name}</span>
                        {med.confidence === 'needs_review' && (
                          <span className="dd__med-review-tag">
                            <AlertCircle size={12} />
                            Needs review
                          </span>
                        )}
                      </div>
                      <div className="dd__med-row">
                        <span className="dd__med-field"><strong>Dosage</strong> {med.dosage}</span>
                        <span className="dd__med-field"><strong>Frequency</strong> {med.frequency}</span>
                        <span className="dd__med-field"><strong>Duration</strong> {med.duration}</span>
                      </div>
                      {med.instructions && (
                        <div className="dd__med-instructions">{med.instructions}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : isBloodReport && record.extracted?.tests ? (
                <div className="dd__blood-report">
                  <table className="dd__report-table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Result</th>
                        <th>Unit</th>
                        <th>Reference</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {record.extracted.tests.map((t, i) => (
                        <tr key={i} className={t.status !== 'normal' ? 'dd__report-row--flag' : ''}>
                          <td>{t.name}</td>
                          <td className="dd__report-value">{t.value}</td>
                          <td>{t.unit}</td>
                          <td className="dd__report-ref">{t.reference}</td>
                          <td><StatusBadge status={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="dd__report-ai-note">
                    <div className="dd__report-ai-heading">
                      <CheckCircle2 size={14} />
                      AI explanation
                    </div>
                    <p className="dd__report-ai-text">
                      Your hemoglobin and WBC values are within normal range. Platelet count is slightly
                      below the reference range — this is noted in the original report. Fasting glucose
                      is marginally elevated. These observations are informational only and do not
                      constitute medical advice. Please consult your doctor for interpretation.
                    </p>
                    <p className="dd__report-ai-disclaimer">
                      AI explanation · Not a medical diagnosis
                    </p>
                  </div>
                </div>
              ) : record.extracted?.summary ? (
                <div className="dd__summary">
                  <p className="dd__summary-text">{record.extracted.summary}</p>
                </div>
              ) : (
                <div className="dd__ai-placeholder">
                  <Clock size={28} />
                  <p>Processing queued — AI extraction available in Phase 5.</p>
                </div>
              )}
            </section>

            {/* QR sharing placeholder */}
            <section className="dd__card">
              <div className="dd__card-head">
                <h3 className="dd__card-title">Share this record</h3>
                <QrCode size={16} style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <div className="dd__share-placeholder">
                <p className="dd__share-text">
                  Generate a time-limited QR code to share this record with an authorised doctor.
                </p>
                <Link to="/patient/share" className="dd__share-link">
                  Go to Share Records →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
