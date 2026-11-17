import { Bot, Lock } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import './AIAssistantPage.css';

const EXAMPLE_QUESTIONS = [
  'What medicines were prescribed in my last visit?',
  'Summarise my most recent blood report.',
  'What was my hemoglobin value in November 2026?',
  'Show prescriptions from the last 3 months.',
  'Are any of my recent test values outside the normal range?',
];

export default function AIAssistantPage() {
  return (
    <AppLayout role="patient" title="AI Assistant">
      <div className="ai-page">
        <div className="ai-page__header">
          <h2 className="ai-page__title">AI Medical Assistant</h2>
          <p className="ai-page__subtitle">
            Ask questions about your uploaded medical records. The assistant answers
            only from your documents and identifies its sources.
          </p>
        </div>

        {/* Chat area preview */}
        <div className="ai-page__chat">
          <div className="ai-page__coming-soon">
            <div className="ai-page__cs-icon">
              <Bot size={28} />
            </div>
            <h3 className="ai-page__cs-title">AI Assistant — Phase 10</h3>
            <p className="ai-page__cs-desc">
              The conversational AI interface will be available after document upload and
              AI extraction are complete (Phases 4–5). It will only answer from your
              authorised records and always cite its source document.
            </p>
          </div>
        </div>

        {/* Example questions */}
        <div className="ai-page__examples">
          <div className="ai-page__examples-label">Example questions you will be able to ask</div>
          <div className="ai-page__examples-list">
            {EXAMPLE_QUESTIONS.map(q => (
              <div key={q} className="ai-page__example-chip" aria-disabled="true">
                {q}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="ai-page__disclaimer">
          <Lock size={13} />
          <span>
            The AI assistant answers using your records only. It does not provide
            diagnoses, prescriptions, or medical advice. Always consult a qualified
            healthcare professional for medical decisions.
          </span>
        </div>
      </div>
    </AppLayout>
  );
}
