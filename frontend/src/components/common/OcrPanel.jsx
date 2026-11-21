import { useState, useEffect, useCallback } from 'react';
import {
  ScanText, RefreshCw, Copy, CheckCheck,
  AlertCircle, Clock, Loader,
} from 'lucide-react';
import { startOcr, getOcrResult } from '../../utils/ocrApi';
import './OcrPanel.css';

/**
 * OcrPanel
 * Reusable component that handles the full OCR lifecycle for one document.
 *
 * Props:
 *   recordId        — medical_records.id
 *   processingStatus — current status from medical_records row
 *   documentType    — 'prescription' | 'blood_report' | etc (selects default engine)
 *   onStatusChange  — callback(newStatus) so parent can refresh its state
 */
export default function OcrPanel({ recordId, processingStatus, documentType, onStatusChange }) {
  const [state,     setState]     = useState('idle'); // idle | loading | done | error
  const [text,      setText]      = useState('');
  const [error,     setError]     = useState('');
  const [copied,    setCopied]    = useState(false);
  const [extractedAt, setExtractedAt] = useState(null);

  // Prescriptions default to Engine 3 (handwriting); everything else Engine 2
  const defaultEngine = documentType === 'prescription' ? 3 : 2;

  // On mount: if the record is already completed, load saved result
  const loadExisting = useCallback(async () => {
    if (!recordId) return;
    const result = await getOcrResult(recordId);
    if (result.success && result.extractedText) {
      setText(result.extractedText);
      setExtractedAt(result.extractedAt);
      setState('done');
    } else if (result.processingStatus === 'processing') {
      setState('loading');
    }
  }, [recordId]);

  useEffect(() => {
    if (processingStatus === 'completed') loadExisting();
    if (processingStatus === 'processing') setState('loading');
  }, [processingStatus, loadExisting]);

  async function handleExtract(engine = defaultEngine, force = false) {
    setState('loading');
    setError('');
    setText('');

    const result = await startOcr(recordId, { engine, force });

    if (!result.success) {
      setState('error');
      setError(result.error || 'OCR failed.');
      onStatusChange?.('failed');
      return;
    }

    setText(result.extractedText);
    setState('done');
    onStatusChange?.('completed');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API blocked (e.g. http context) — silent fail
    }
  }

  return (
    <div className="ocr-panel">
      {/* Header */}
      <div className="ocr-panel__header">
        <div className="ocr-panel__title">
          <ScanText size={16} />
          <span>Extracted Text (OCR)</span>
        </div>

        <div className="ocr-panel__actions">
          {state === 'done' && (
            <>
              <button
                className="ocr-panel__btn ocr-panel__btn--ghost"
                onClick={handleCopy}
                title="Copy text"
              >
                {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                className="ocr-panel__btn ocr-panel__btn--ghost"
                onClick={() => handleExtract(defaultEngine, true)}
                title="Re-run OCR"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </>
          )}
          {(state === 'idle' || state === 'error') && (
            <>
              <button
                className="ocr-panel__btn ocr-panel__btn--primary"
                onClick={() => handleExtract(defaultEngine)}
              >
                <ScanText size={14} />
                Extract text
              </button>
              {documentType === 'prescription' && (
                <button
                  className="ocr-panel__btn ocr-panel__btn--ghost"
                  onClick={() => handleExtract(2)}
                  title="Use Engine 2 (printed text)"
                >
                  Engine 2
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="ocr-panel__disclaimer">
        <AlertCircle size={12} />
        <span>
          Text is extracted by the OCR.space API. Always verify extracted medical content with
          the original document. Do not use extracted text as a substitute for professional advice.
        </span>
      </div>

      {/* Body */}
      <div className="ocr-panel__body">
        {state === 'idle' && (
          <div className="ocr-panel__placeholder">
            <ScanText size={28} />
            <p>Click <strong>Extract text</strong> to run OCR on this document.</p>
            <p className="ocr-panel__hint">
              Uses OCR.space API · Max 1 MB · Prescriptions use Engine 3 (handwriting)
            </p>
          </div>
        )}

        {state === 'loading' && (
          <div className="ocr-panel__placeholder">
            <Loader size={28} className="ocr-panel__spinner" />
            <p>Extracting text…</p>
            <p className="ocr-panel__hint">This usually takes 5–15 seconds.</p>
          </div>
        )}

        {state === 'error' && (
          <div className="ocr-panel__error-block">
            <AlertCircle size={18} />
            <div>
              <strong>Extraction failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {state === 'done' && (
          <>
            {extractedAt && (
              <div className="ocr-panel__meta">
                <Clock size={12} />
                Extracted on{' '}
                {new Date(extractedAt).toLocaleString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            )}
            <pre className="ocr-panel__text">{text}</pre>
          </>
        )}
      </div>
    </div>
  );
}
