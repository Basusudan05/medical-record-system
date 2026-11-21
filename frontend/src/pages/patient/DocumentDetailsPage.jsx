import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Calendar, Clock,
  AlertCircle, QrCode, Download, Eye,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OcrPanel from '../../components/common/OcrPanel';
import DocumentPreviewModal from '../../components/common/DocumentPreviewModal';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../hooks/useDocuments';
import { supabase } from '../../lib/supabase';
import './DocumentDetailsPage.css';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatSize(bytes, kb) {
  const b = bytes || (kb ? kb * 1024 : 0);
  if (!b) return '—';
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSignedUrl } = useDocuments();

  const [record,    setRecord]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [toast,     setToast]     = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch the specific record from Supabase (enforces RLS — user can only get their own)
  useEffect(() => {
    if (!user?.id || !id) return;

    async function load() {
      setLoading(true);
      setError('');
      const { data, error: err } = await supabase
        .from('medical_records')
        .select('*')
        .eq('id', id)
        .eq('patient_id', user.id)
        .single();

      if (err || !data) {
        setError('Document not found or you do not have access to it.');
      } else {
        setRecord(data);
      }
      setLoading(false);
    }

    load();
  }, [id, user?.id]);

  async function handlePreview() {
    if (!record?.file_path) return;
    setPreviewUrl(null);
    setShowPreview(true);
    const url = await getSignedUrl(record.file_path);
    setPreviewUrl(url);
  }

  async function handleDownload() {
    if (!record?.file_path) return;
    const url = await getSignedUrl(record.file_path);
    if (!url) { setToast({ message: 'Could not generate download link.', type: 'error' }); return; }
    const a = document.createElement('a');
    a.href = url; a.download = record.document_name || 'document';
    a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  // Called by OcrPanel after successful/failed OCR to refresh status badge
  function handleStatusChange(newStatus) {
    setRecord(prev => prev ? { ...prev, processing_status: newStatus } : prev);
  }

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <AppLayout role="patient" title="Record Details">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <LoadingSpinner size="lg" label="Loading document…" />
        </div>
      </AppLayout>
    );
  }

  // ── Error / not found ─────────────────────────────────────────
  if (error || !record) {
    return (
      <AppLayout role="patient" title="Record Details">
        <EmptyState
          icon={FileText}
          title="Document not found"
          message={error || 'This document does not exist or has been removed.'}
          action={{ label: 'Back to history', onClick: () => navigate('/patient/history') }}
        />
      </AppLayout>
    );
  }

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
            <div className="dd__header-icon"><FileText size={20} /></div>
            <div>
              <h2 className="dd__title">{record.document_name}</h2>
              <div className="dd__header-meta">
                <DocTypeBadge type={record.document_type} />
                <StatusBadge status={record.processing_status} />
                <span className="dd__meta-date">
                  <Calendar size={12} />
                  {formatDate(record.created_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="dd__header-actions">
            <button className="dd__btn-ghost" onClick={handlePreview}>
              <Eye size={15} />
              Preview
            </button>
            <button className="dd__btn-ghost" onClick={handleDownload}>
              <Download size={15} />
              Download
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="dd__layout">
          {/* Left column */}
          <div className="dd__col-left">
            {/* Document info */}
            <section className="dd__card">
              <h3 className="dd__card-title">Document information</h3>
              <div className="dd__info-grid">
                <div className="dd__info-item">
                  <span className="dd__info-label">Category</span>
                  <span className="dd__info-value">
                    <DocTypeBadge type={record.document_type} />
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">File type</span>
                  <span className="dd__info-value">
                    {record.original_file_type?.split('/')[1]?.toUpperCase() || '—'}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">File size</span>
                  <span className="dd__info-value">
                    {formatSize(record.file_size_bytes, record.file_size_kb)}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">Uploaded</span>
                  <span className="dd__info-value">
                    <Clock size={13} />
                    {formatDate(record.created_at)}
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">AI Status</span>
                  <span className="dd__info-value">
                    <StatusBadge status={record.processing_status} />
                  </span>
                </div>
                <div className="dd__info-item">
                  <span className="dd__info-label">Verification</span>
                  <span className="dd__info-value">
                    <StatusBadge status={record.verification_status} />
                  </span>
                </div>
              </div>
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

          {/* Right column — OCR */}
          <div className="dd__col-right">
            <OcrPanel
              recordId={record.id}
              processingStatus={record.processing_status}
              documentType={record.document_type}
              onStatusChange={handleStatusChange}
            />

            {/* Notice */}
            <div className="dd__ai-notice" style={{ marginTop: 'var(--space-4)' }}>
              <AlertCircle size={14} />
              <span>
                Extracted text is provided for reference only. Never use OCR output as a substitute
                for the original document or professional medical advice.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <DocumentPreviewModal
          record={record}
          signedUrl={previewUrl}
          onClose={() => { setShowPreview(false); setPreviewUrl(null); }}
          onDownload={handleDownload}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </AppLayout>
  );
}
