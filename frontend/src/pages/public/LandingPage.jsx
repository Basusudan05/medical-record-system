import { Link } from 'react-router-dom';
import {
  Activity,
  Brain,
  Clock,
  QrCode,
  ShieldCheck,
  FileText,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Prescription Understanding',
    description:
      'Extract medicine names, dosages, and instructions from both printed and handwritten prescriptions using computer vision.',
  },
  {
    icon: FileText,
    title: 'Medical Report Analysis',
    description:
      'Automatically structure lab values, flag abnormal results, and generate plain-language summaries of complex reports.',
  },
  {
    icon: Clock,
    title: 'Complete Medical History',
    description:
      'All records are stored chronologically with category filters, full-text search, and instant access to originals.',
  },
  {
    icon: QrCode,
    title: 'Secure QR Sharing',
    description:
      'Generate time-limited, revocable QR access tokens to share specific records with any authorised doctor.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by Design',
    description:
      'Row-level database security, private storage buckets, and signed URLs ensure only you control who sees what.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload or scan', desc: 'Upload a photo or PDF of your prescription, lab report, or discharge summary from any device.' },
  { step: '02', title: 'AI processes',   desc: 'Our AI extracts structured medical data, flags uncertain values, and generates a readable summary.' },
  { step: '03', title: 'Review & share', desc: 'Verify the extracted information, then share selected records with any doctor via a secure QR code.' },
];

export default function LandingPage() {
  return (
    <div className="land">
      {/* ── Navbar ── */}
      <nav className="land__nav">
        <div className="land__nav-inner">
          <div className="land__brand">
            <Activity size={20} className="land__brand-icon" />
            <span className="land__brand-name">MediVault</span>
          </div>
          <div className="land__nav-links">
            <a href="#features" className="land__nav-link">Features</a>
            <a href="#how" className="land__nav-link">How it works</a>
            <Link to="/login" className="land__nav-link">Log in</Link>
            <Link to="/register" className="land__nav-cta">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="land__hero">
        <div className="land__hero-inner">
          <div className="land__hero-text">
            <div className="land__eyebrow">AI-powered medical records</div>
            <h1 className="land__hero-h1">
              Your health records,<br />understood and organised.
            </h1>
            <p className="land__hero-p">
              MediVault uses AI to read your prescriptions and medical reports,
              extract structured information, and keep your complete medical
              history securely accessible — from any device, at any time.
            </p>
            <div className="land__hero-actions">
              <Link to="/register" className="land__btn-primary">
                Create free account <ChevronRight size={15} />
              </Link>
              <Link to="/login" className="land__btn-outline">
                Sign in
              </Link>
            </div>
            <ul className="land__trust-list">
              {['No credit card required', 'Demo data included', 'Private and encrypted'].map(t => (
                <li key={t}>
                  <CheckCircle size={14} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard preview — static wireframe */}
          <div className="land__preview" aria-hidden="true">
            <div className="land__preview-bar">
              <span className="land__preview-dot land__preview-dot--red" />
              <span className="land__preview-dot land__preview-dot--yellow" />
              <span className="land__preview-dot land__preview-dot--green" />
              <span className="land__preview-url">medivault.app / dashboard</span>
            </div>
            <div className="land__preview-body">
              <div className="land__preview-sidebar">
                {['Overview', 'Upload', 'History', 'AI Chat', 'Share'].map(l => (
                  <div
                    key={l}
                    className={`land__preview-nav-item${l === 'Overview' ? ' land__preview-nav-item--active' : ''}`}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="land__preview-content">
                <div className="land__preview-heading">Good morning, Arjun</div>
                <div className="land__preview-stats">
                  {[['6', 'Records'], ['2', 'Prescriptions'], ['4', 'Reports'], ['1', 'Shared']].map(([v, l]) => (
                    <div key={l} className="land__preview-stat">
                      <span className="land__preview-stat-num">{v}</span>
                      <span className="land__preview-stat-lbl">{l}</span>
                    </div>
                  ))}
                </div>
                <div className="land__preview-table-head">
                  <span>Document</span><span>Type</span><span>Status</span>
                </div>
                {[
                  ['Dr. Kapoor — Prescription', 'Prescription', 'Verified'],
                  ['Blood Report — Nov 2026', 'Blood Report', 'Verified'],
                  ['Chest X-Ray Report', 'X-Ray', 'Pending'],
                ].map(([name, type, status]) => (
                  <div key={name} className="land__preview-row">
                    <span className="land__preview-row-name">{name}</span>
                    <span className="land__preview-tag">{type}</span>
                    <span className={`land__preview-status land__preview-status--${status.toLowerCase()}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="land__features" id="features">
        <div className="land__section-inner">
          <div className="land__section-label">Features</div>
          <h2 className="land__section-h2">Built around how patients actually use medical records</h2>
          <div className="land__features-grid">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="land__feature-card">
                <div className="land__feature-icon">
                  <Icon size={18} />
                </div>
                <h3 className="land__feature-title">{title}</h3>
                <p className="land__feature-desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="land__how" id="how">
        <div className="land__section-inner land__section-inner--narrow">
          <div className="land__section-label">How it works</div>
          <h2 className="land__section-h2">From document to structured data in seconds</h2>
          <div className="land__steps">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="land__step">
                <div className="land__step-number">{step}</div>
                <div>
                  <h3 className="land__step-title">{title}</h3>
                  <p className="land__step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land__cta">
        <div className="land__section-inner land__section-inner--narrow land__cta-inner">
          <h2 className="land__cta-h2">Start managing your health records today</h2>
          <p className="land__cta-p">
            Free to use. Synthetic demo data included so you can explore every feature before uploading anything real.
          </p>
          <Link to="/register" className="land__btn-primary">
            Create your account <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="land__footer">
        <div className="land__footer-inner">
          <div className="land__brand">
            <Activity size={16} className="land__brand-icon" />
            <span className="land__brand-name">MediVault</span>
          </div>
          <nav className="land__footer-links">
            <a href="#">About</a>
            <a href="#features">Features</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
            <Link to="/login">Login</Link>
          </nav>
          <p className="land__footer-disclaimer">
            Demonstration purposes only. Not clinically validated.
          </p>
        </div>
      </footer>
    </div>
  );
}
