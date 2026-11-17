import { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import './UploadPage.css';

const CATEGORIES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'blood_report',  label: 'Blood Report' },
  { value: 'xray',          label: 'X-Ray Report' },
  { value: 'discharge',     label: 'Discharge Summary' },
  { value: 'other',         label: 'Other' },
];

const ACCEPTED = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_MB = 10;

function FilePreview({ file, onRemove }) {
  const isPdf = file.type === 'application/pdf';
  return (
    <div className="up__file-preview">
      <div className="up__file-icon">
        <FileText size={20} />
      </div>
      <div className="up__file-info">
        <span className="up__file-name">{file.name}</span>
        <span className="up__file-size">{(file.size / 1024).toFixed(0)} KB · {file.type.split('/')[1].toUpperCase()}</span>
      </div>
      <button className="up__file-remove" onClick={onRemove} aria-label="Remove file">
        <X size={15} />
      </button>
    </div>
  );
}

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  function validateFile(f) {
    if (!ACCEPTED.includes(f.type)) {
      return 'Only JPG, PNG, and PDF files are supported.';
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      return `File must be under ${MAX_MB} MB.`;
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
    setSubmitted(false);
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError('Please select a file to upload.'); return; }
    if (!category) { setError('Please select a document category.'); return; }
    setError('');
    // Real upload wired in Phase 4
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AppLayout role="patient" title="Upload / Scan">
        <div className="up__success">
          <CheckCircle size={40} className="up__success-icon" />
          <h2 className="up__success-title">Document uploaded</h2>
          <p className="up__success-sub">
            AI processing will be available in Phase 5. Your document has been queued.
          </p>
          <div className="up__success-actions">
            <button className="up__btn-primary" onClick={() => { setFile(null); setCategory(''); setSubmitted(false); }}>
              Upload another
            </button>
            <a href="/patient/history" className="up__btn-secondary">
              View history
            </a>
          </div>
        </div>
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
            AI extraction is applied automatically after upload.
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
              onClick={() => !file && inputRef.current.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload area"
              onKeyDown={e => e.key === 'Enter' && !file && inputRef.current.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleInputChange}
                className="visually-hidden"
                aria-hidden="true"
              />

              {file ? (
                <FilePreview file={file} onRemove={() => { setFile(null); setError(''); }} />
              ) : (
                <div className="up__dropzone-idle">
                  <div className="up__dropzone-icon">
                    <Upload size={24} />
                  </div>
                  <p className="up__dropzone-label">
                    Drag a file here, or{' '}
                    <span className="up__dropzone-browse">browse</span>
                  </p>
                  <p className="up__dropzone-hint">
                    JPG, PNG, PDF — up to {MAX_MB} MB
                  </p>
                </div>
              )}
            </div>

            {/* Camera button */}
            <button
              type="button"
              className="up__camera-btn"
              onClick={() => inputRef.current && inputRef.current.click()}
            >
              <Camera size={15} />
              Capture using camera
            </button>

            {/* Category */}
            <div className="up__field">
              <label className="up__label" htmlFor="category">
                Document category <span className="up__required">*</span>
              </label>
              <div className="up__category-grid">
                {CATEGORIES.map(c => (
                  <label
                    key={c.value}
                    className={`up__category-opt${category === c.value ? ' up__category-opt--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={category === c.value}
                      onChange={() => setCategory(c.value)}
                      className="visually-hidden"
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

            <button type="submit" className="up__btn-primary up__btn-primary--full">
              <Upload size={15} />
              Upload document
            </button>
          </form>

          {/* Info panel */}
          <aside className="up__info-panel">
            <h3 className="up__info-title">What happens after upload?</h3>
            <ol className="up__info-steps">
              {[
                { n: 1, t: 'File is stored securely', d: 'Your original document is saved to private encrypted storage.' },
                { n: 2, t: 'Image preprocessing', d: 'Contrast and rotation are corrected for better OCR accuracy.' },
                { n: 3, t: 'Text extraction', d: 'OCR reads both printed and handwritten text from the document.' },
                { n: 4, t: 'AI structuring', d: 'The AI converts raw text into structured fields — medicines, dosages, test values.' },
                { n: 5, t: 'You review and verify', d: 'You can confirm or correct the extracted data before it is marked verified.' },
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
                AI extraction is available in Phase 5. Documents uploaded now will be queued for processing.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
