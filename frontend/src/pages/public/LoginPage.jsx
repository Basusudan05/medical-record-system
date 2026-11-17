import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to the page the user was trying to reach
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) { setError('Email address is required.'); return; }
    if (!form.password)     { setError('Password is required.'); return; }

    setSubmitting(true);
    const result = await login({ email: form.email, password: form.password });
    setSubmitting(false);

    if (!result.success) {
      // Map Supabase error messages to friendly text
      if (result.error?.toLowerCase().includes('invalid login')) {
        setError('Incorrect email or password. Please try again.');
      } else if (result.error?.toLowerCase().includes('email not confirmed')) {
        setError('Please check your email and confirm your account first.');
      } else {
        setError(result.error || 'Sign in failed. Please try again.');
      }
      return;
    }

    // Navigate to intended destination or role-based dashboard
    // Role-based redirect is handled by PublicOnlyRoute / AuthContext
    navigate(from || '/patient/dashboard', { replace: true });
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

          {/* Error banner */}
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

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
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-field">
              <div className="form-field__label-row">
                <label className="form-field__label" htmlFor="password">
                  Password
                </label>
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
                  disabled={submitting}
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-card__switch">
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
