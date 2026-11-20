import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Toast from '../../components/common/Toast';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../hooks/useDocuments';
import './UploadPage.css';

const CATEGORIES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'blood_report', label: 'Blood Report' },
  { value: 'xray',         label: 'X-Ray / Imaging' },
  { value: 'discharge',    label: 'Discharge Summary' },
  { value: 'other',        label: 'Other' },
];

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.pdf';
const MAX_MB   = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreview({ file, onRemove }) {
  return (
    <div className="up__file-preview">
      <div className="up__file-icon">
        <FileText size={20} />
      </div>
      <div className="up__file-info">
        <span className="up__file-name">{file.name}</span>
        <span className="up__file-size">
          {formatFileSize(file.size)} · {file.type.split('/')[1].toUpperCase()}
        </span>
      </div>
      <button className="up__file-remove" onClick={onRemove} aria-label="Remove file">
        <X size={15} />
      </button>
    </div>
  );
}

export default function UploadPage() {
  const { user } = useAuth();
  const { uploadDocument } = useDocuments();
  const navigate = useNavigate();

  const [dragOver,      setDragOver]      = useState(false);
  const [file,          setFile]          = useState(null);
  const [category,      setCategory]      = useState('');
  const [documentName,  setDocumentName]  = useState('');
  const [error,         setError]         = useState('');
  const [uploading,     setUploading]     = useState(false);
  const [uploadedRecord, setUploadedRecord] = useState(null);
  const [toast,         setToast]         = useState(null);
  const inputRef = useRef(null);

  function validateFile(f) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Unsupported file type. Use JPG, PNG, WEBP, or PDF.';
    }
    if (f.size > MAX_BYTES) {
      return `File is too large. Maximum size is ${MAX_MB} MB.`;
    }
    return null;
  }

  function handleFiles(files) {
    const f = files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError('');
    setFile(f);
    // Pre-fill the document name with the file name (without extension)
    if (!documentName) {
      const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '');
      setDocumentName(nameWithoutExt);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleInputChange(e) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!file)     { setError('Please select a file to upload.'); return; }
    if (!category) { setError('Please select a document category.'); return; }
    if (!user?.id) { setError('You must be logged in to upload.'); return; }

    setUploading(true);
    const result = await uploadDocument({
      userId:       user.id,
      file,
      category,
      documentName: documentName.trim() || file.name,
    });
    setUploading(false);

    if (!result.success) {
      setError(result.error || 'Upload failed. Please try again.');
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
      return;
    }

    setUploadedRecord(result.record);
    setToast({ message: 'Document uploaded successfully!', type: 'success' });
  }

  function handleUploadAnother() {
    setFile(null);
    setCategory('');
    setDocumentName('');
    setError('');
    setUploadedRecord(null);
    setToast(null);
  }

  // ── Success screen ────────────────────────────────────────────
  if (uploadedRecord) {
    return (
      <AppLayout role="patient" title="Upload / Scan">
        <div className="up__success">
          <CheckCircle size={44} className="up__success-icon" />
          <h2 className="up__success-title">Document uploaded</h2>
          <p className="up__success-sub">
            <strong>{uploadedRecord.document_name}</strong> has been saved securely.
            It is queued for AI analysis (available in Phase 5).
          </p>
          <div className="up__success-meta">
            <span>Category: {CATEGORIES.find(c => c.value === uploadedRecord.document_type)?.label}</span>
            <span>Size: {formatFileSize(uploadedRecord.file_size_bytes || uploadedRecord.file_size_kb * 1024)}</span>
          </div>
          <div className="up__success-actions">
            <button className="up__btn-primary" onClick={handleUploadAnother}>
              Upload another
            </button>
            <button
              className="up__btn-secondary"
              onClick={() => navigate('/patient/history')}
            >
              View history
            </button>
          </div>
        </div>
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

  return (
    <AppLayout role="patient" title="Upload / Scan">
      <div className="up">
        <div className="up__header">
          <h2 className="up__title">Upload a medical document</h2>
          <p className="up__subtitle">
            Upload a prescription, lab report, X-ray, or discharge summary.
            Supported formats: JPG, PNG, WEBP, PDF — up to {MAX_MB} MB.
          </p>
        </div>

        <div className="up__layout">
          {/* Upload form */}
          <form className="up__form" onSubmit={handleSubmit} noValidate>

            {/* Drop zone */}
            <div
              className={`up__dropzone${dragOver ? ' up__dropzone--over' : ''}${file ? ' up__dropzone--has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && !uploading && inputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload area — click or drag a file here"
              onKeyDown={e => e.key === 'Enter' && !file && !uploading && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleInputChange}
                className="visually-hidden"
                aria-hidden="true"
                disabled={uploading}
              />

              {file ? (
                <FilePreview
                  file={file}
                  onRemove={() => { setFile(null); setDocumentName(''); setError(''); }}
                />
              ) : (
                <div className="up__dropzone-idle">
                  <div className="up__dropzone-icon">
                    <Upload size={24} />
                  </div>
                  <p className="up__dropzone-label">
                    Drag a file here, or{' '}
                    <span className="up__dropzone-browse">browse</span>
                  </p>
                  <p className="up__dropzone-hint">JPG, PNG, WEBP, PDF — up to {MAX_MB} MB</p>
                </div>
              )}
            </div>

            {/* Camera / browse secondary button */}
            {!file && (
              <button
                type="button"
                className="up__camera-btn"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={15} />
                Capture using camera
              </button>
            )}

            {/* Document name */}
            <div className="up__field">
              <label className="up__label" htmlFor="doc-name">
                Document name <span className="up__optional">(optional)</span>
              </label>
              <input
                id="doc-name"
                type="text"
                value={documentName}
                onChange={e => setDocumentName(e.target.value)}
                placeholder="e.g. Dr. Kapoor Prescription — Nov 2026"
                className="up__text-input"
                maxLength={200}
                disabled={uploading}
              />
            </div>

            {/* Category */}
            <div className="up__field">
              <label className="up__label">
                Document category <span className="up__required">*</span>
              </label>
              <div className="up__category-grid">
                {CATEGORIES.map(c => (
                  <label
                    key={c.value}
                    className={`up__category-opt${category === c.value ? ' up__category-opt--active' : ''}${uploading ? ' up__category-opt--disabled' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={category === c.value}
                      onChange={() => setCategory(c.value)}
                      className="visually-hidden"
                      disabled={uploading}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="up__error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Upload button */}
            <button
              type="submit"
              className="up__btn-primary up__btn-primary--full"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="up__spinner" aria-hidden="true" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Upload document
                </>
              )}
            </button>
          </form>

          {/* Info panel */}
          <aside className="up__info-panel">
            <h3 className="up__info-title">What happens after upload?</h3>
            <ol className="up__info-steps">
              {[
                { n: 1, t: 'Stored securely',       d: 'Your file is saved to private encrypted storage. Only you can access it.' },
                { n: 2, t: 'Image preprocessing',   d: 'Contrast and rotation are corrected for better OCR accuracy.' },
                { n: 3, t: 'Text extraction',        d: 'OCR reads both printed and handwritten text from the document.' },
                { n: 4, t: 'AI structuring',         d: 'The AI converts raw text into structured fields — medicines, dosages, test values.' },
                { n: 5, t: 'Review and verify',      d: 'You can confirm or correct the extracted data before it is marked verified.' },
              ].map(({ n, t, d }) => (
                <li key={n} className="up__info-step">
                  <span className="up__info-step-num">{n}</span>
                  <div>
                    <div className="up__info-step-title">{t}</div>
                    <div className="up__info-step-desc">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="up__info-note">
              <AlertCircle size={14} />
              <span>
                Steps 2–5 are available from Phase 5 onwards. Your document is securely stored immediately.
              </span>
            </div>
          </aside>
        </div>
      </div>

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
