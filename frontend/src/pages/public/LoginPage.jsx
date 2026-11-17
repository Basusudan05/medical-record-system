import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock, CheckCircle } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Authentication wired in Phase 3
  }

  return (
    <div className="auth-layout">
      {/* Left brand panel */}
      <div className="auth-layout__brand">
        <div className="auth-layout__brand-logo">
          <Activity size={20} />
          <span>MediVault</span>
        </div>
        <div className="auth-layout__brand-quote">
          <h2 className="auth-layout__brand-heading">
            Your complete medical history, always within reach.
          </h2>
          <p className="auth-layout__brand-sub">
            AI-powered document understanding, secure QR sharing, and a
            chronological record of every prescription and report.
          </p>
          <div className="auth-layout__brand-features">
            {[
              'AI reads handwritten prescriptions',
              'Instant structured lab report analysis',
              'Secure time-limited QR sharing',
              'Private by default — you control access',
            ].map(f => (
              <div key={f} className="auth-layout__brand-feat">
                <CheckCircle size={15} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#334155' }}>
          Demonstration purposes only. Not clinically validated.
        </p>
      </div>

      {/* Right form panel */}
      <div className="auth-layout__form-panel">
        <div className="auth-card">
          <h1 className="auth-card__title">Sign in</h1>
          <p className="auth-card__subtitle">
            Welcome back — enter your credentials to continue.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-field__label" htmlFor="email">
                Email address
              </label>
              <div className="form-field__input-wrap">
                <Mail size={15} className="form-field__icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-field__input form-field__input--icon"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="form-field__label-row">
                <label className="form-field__label" htmlFor="password">
                  Password
                </label>
                <a href="#" className="form-field__forgot">
                  Forgot password?
                </a>
              </div>
              <div className="form-field__input-wrap">
                <Lock size={15} className="form-field__icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-field__input form-field__input--icon form-field__input--padded-right"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="form-field__toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign in
            </button>
          </form>

          <p className="auth-card__switch">
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>

          {/* Demo shortcut */}
          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              Demo access
            </p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Use <strong>patient@demo.com</strong> or <strong>doctor@demo.com</strong> with any password.
              Authentication is implemented in Phase 3.
            </p>
            <Link
              to="/patient/dashboard"
              style={{ display: 'inline-block', marginTop: 'var(--space-3)', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-teal)' }}
            >
              → View patient dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
