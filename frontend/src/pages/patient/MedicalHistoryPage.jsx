import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ArrowRight, Clock, FileText,
  Eye, Download, Trash2, Upload,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DocumentPreviewModal from '../../components/common/DocumentPreviewModal';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../hooks/useDocuments';
import './MedicalHistoryPage.css';

const FILTERS = [
  { value: '',             label: 'All Records' },
  { value: 'prescription', label: 'Prescriptions' },
  { value: 'blood_report', label: 'Blood Reports' },
  { value: 'xray',         label: 'X-Ray / Imaging' },
  { value: 'discharge',    label: 'Discharge Summaries' },
  { value: 'other',        label: 'Other' },
];

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatSize(bytes, kb) {
  const b = bytes || (kb ? kb * 1024 : 0);
  if (!b) return '—';
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MedicalHistoryPage() {
  const { user } = useAuth();
  const {
    documents, loading, error,
    fetchDocuments, deleteDocument, getSignedUrl,
  } = useDocuments();

  const [activeFilter, setActiveFilter] = useState('');
  const [search,       setSearch]       = useState('');
  const [toast,        setToast]        = useState(null);

  // Delete flow
  const [deleteTarget,  setDeleteTarget]  = useState(null); // record to delete
  const [deleting,      setDeleting]      = useState(false);

  // Preview flow
  const [previewRecord, setPreviewRecord] = useState(null);
  const [previewUrl,    setPreviewUrl]    = useState(null);

  // Load documents when user is available
  useEffect(() => {
    if (user?.id) fetchDocuments(user.id);
  }, [user?.id, fetchDocuments]);

  // Filter + search (client-side, documents are already user-scoped from DB)
  const filtered = useMemo(() => {
    return documents.filter(r => {
      const matchType   = !activeFilter || r.document_type === activeFilter;
      const q           = search.trim().toLowerCase();
      const matchSearch = !q || r.document_name?.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [documents, activeFilter, search]);

  // ── Preview ───────────────────────────────────────────────────
  async function handlePreview(record) {
    setPreviewRecord(record);
    setPreviewUrl(null);
    const url = await getSignedUrl(record.file_path);
    setPreviewUrl(url);
  }

  // ── Download ─────────────────────────────────────────────────
  async function handleDownload(record) {
    const url = await getSignedUrl(record.file_path);
    if (!url) {
      setToast({ message: 'Could not generate download link.', type: 'error' });
      return;
    }
    const a = document.createElement('a');
    a.href     = url;
    a.download = record.document_name || 'document';
    a.target   = '_blank';
    a.rel      = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Delete ────────────────────────────────────────────────────
  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteDocument({
      recordId:    deleteTarget.id,
      storagePath: deleteTarget.file_path,
    });
    setDeleting(false);
    setDeleteTarget(null);

    if (result.success) {
      setToast({ message: 'Document deleted.', type: 'success' });
    } else {
      setToast({ message: result.error || 'Delete failed.', type: 'error' });
    }
  }

  return (
    <AppLayout role="patient" title="Medical History">
      <div className="mh">
        {/* Header */}
        <div className="mh__header">
          <div>
            <h2 className="mh__title">Medical History</h2>
            <p className="mh__subtitle">
              {loading ? 'Loading…' : `${documents.length} record${documents.length !== 1 ? 's' : ''} · all your uploaded documents`}
            </p>
          </div>
          <Link to="/patient/upload" className="mh__upload-btn">
            <Upload size={14} />
            Upload document
          </Link>
        </div>

        {/* Controls */}
        <div className="mh__controls">
          <div className="mh__search">
            <Search size={14} className="mh__search-icon" />
            <input
              type="search"
              placeholder="Search by document name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mh__search-input"
            />
          </div>
          <div className="mh__filters">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`mh__filter-btn${activeFilter === f.value ? ' mh__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mh__loading">
            <LoadingSpinner size="md" label="Loading documents…" />
            <span>Loading your documents…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <ErrorMessage
            message={`Failed to load documents: ${error}`}
            onRetry={() => fetchDocuments(user?.id)}
          />
        )}

        {/* Empty state */}
        {!loading && !error && documents.length === 0 && (
          <div className="mh__empty">
            <EmptyState
              icon={FileText}
              title="No documents yet"
              message="Upload your first medical document to get started."
              action={{ label: 'Upload document', onClick: () => window.location.href = '/patient/upload' }}
            />
          </div>
        )}

        {/* Filter empty */}
        {!loading && !error && documents.length > 0 && filtered.length === 0 && (
          <div className="mh__empty">
            <EmptyState
              icon={Search}
              title="No results"
              message="No documents match your current search or filter."
            />
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mh__table-wrap">
            <table className="mh__table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <span className="mh__doc-name">{rec.document_name}</span>
                      <span className="mh__doc-type">
                        {rec.original_file_type?.split('/')[1]?.toUpperCase() || '—'}
                      </span>
                    </td>
                    <td><DocTypeBadge type={rec.document_type} /></td>
                    <td className="mh__size">
                      {formatSize(rec.file_size_bytes, rec.file_size_kb)}
                    </td>
                    <td>
                      <span className="mh__date">
                        <Clock size={11} />
                        {formatDate(rec.created_at)}
                      </span>
                    </td>
                    <td><StatusBadge status={rec.processing_status} /></td>
                    <td>
                      <div className="mh__actions">
                        <button
                          className="mh__action-btn"
                          onClick={() => handlePreview(rec)}
                          title="Preview"
                          aria-label="Preview document"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="mh__action-btn"
                          onClick={() => handleDownload(rec)}
                          title="Download"
                          aria-label="Download document"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          className="mh__action-btn mh__action-btn--danger"
                          onClick={() => setDeleteTarget(rec)}
                          title="Delete"
                          aria-label="Delete document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <p className="mh__count">
            Showing {filtered.length} of {documents.length} records
          </p>
        )}
      </div>

      {/* Preview modal */}
      {previewRecord && (
        <DocumentPreviewModal
          record={previewRecord}
          signedUrl={previewUrl}
          onClose={() => { setPreviewRecord(null); setPreviewUrl(null); }}
          onDownload={() => handleDownload(previewRecord)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete document?"
          message={`"${deleteTarget.document_name}" will be permanently deleted from storage and your records. This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  );
}
