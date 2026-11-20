import { useEffect, useState } from 'react';
import { X, Download, ExternalLink, FileText, Loader } from 'lucide-react';
import './DocumentPreviewModal.css';

/**
 * DocumentPreviewModal
 *
 * Props:
 *   record      — medical_records row
 *   signedUrl   — pre-generated signed URL string (or null while loading)
 *   onClose     — called to close the modal
 *   onDownload  — called when download is clicked
 */
export default function DocumentPreviewModal({ record, signedUrl, onClose, onDownload }) {
  const isImage = record?.original_file_type?.startsWith('image/');
  const isPdf   = record?.original_file_type === 'application/pdf';

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="preview-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="preview-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-modal__header">
          <div className="preview-modal__info">
            <FileText size={16} />
            <span className="preview-modal__name">{record?.document_name}</span>
          </div>
          <div className="preview-modal__actions">
            {signedUrl && (
              <>
                <button className="preview-modal__action-btn" onClick={onDownload} title="Download">
                  <Download size={16} />
                </button>
                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="preview-modal__action-btn"
                  title="Open in new tab"
                >
                  <ExternalLink size={16} />
                </a>
              </>
            )}
            <button className="preview-modal__close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="preview-modal__body">
          {!signedUrl ? (
            <div className="preview-modal__loading">
              <Loader size={28} className="preview-modal__spinner" />
              <p>Loading preview…</p>
            </div>
          ) : isImage ? (
            <img
              src={signedUrl}
              alt={record?.document_name}
              className="preview-modal__image"
            />
          ) : isPdf ? (
            <iframe
              src={signedUrl}
              title={record?.document_name}
              className="preview-modal__pdf"
            />
          ) : (
            <div className="preview-modal__unsupported">
              <FileText size={40} />
              <p>Preview not available for this file type.</p>
              <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="preview-modal__open-link">
                Open file in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
