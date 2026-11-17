import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Eye, EyeOff, Mail, Lock, User, Stethoscope, CheckCircle } from 'lucide-react';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Registration wired in Phase 3
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
            One place for every medical document, understood by AI.
          </h2>
          <p className="auth-layout__brand-sub">
            Stop carrying paper prescriptions and scattered lab reports.
            MediVault organises everything and explains it in plain language.
          </p>
          <div className="auth-layout__brand-features">
            {[
              'Create a free account in under a minute',
              'Upload prescriptions immediately after signing up',
              'AI extracts and structures medical data automatically',
              'Share records securely with any doctor, any time',
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
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__subtitle">
            Free to use. Synthetic demo data included.
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Full name */}
            <div className="form-field">
              <label className="form-field__label" htmlFor="full_name">
                Full name
              </label>
              <div className="form-field__input-wrap">
                <User size={15} className="form-field__icon" />
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="form-field__input form-field__input--icon"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="form-field">
              <label className="form-field__label" htmlFor="password">
                Password
              </label>
              <div className="form-field__input-wrap">
                <Lock size={15} className="form-field__icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="form-field__input form-field__input--icon form-field__input--padded-right"
                  autoComplete="new-password"
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

            {/* Confirm password */}
            <div className="form-field">
              <label className="form-field__label" htmlFor="confirm_password">
                Confirm password
              </label>
              <div className="form-field__input-wrap">
                <Lock size={15} className="form-field__icon" />
                <input
                  id="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="form-field__input form-field__input--icon form-field__input--padded-right"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="form-field__toggle"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Hide' : 'Show'}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div className="form-field">
              <label className="form-field__label">Account type</label>
              <div className="role-selector">
                <label className={`role-option${form.role === 'patient' ? ' role-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={form.role === 'patient'}
                    onChange={handleChange}
                    className="visually-hidden"
                  />
                  <User size={16} />
                  <span>Patient</span>
                </label>
                <label className={`role-option${form.role === 'doctor' ? ' role-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={form.role === 'doctor'}
                    onChange={handleChange}
                    className="visually-hidden"
                  />
                  <Stethoscope size={16} />
                  <span>Doctor</span>
                </label>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Create account
            </button>
          </form>

          <p className="auth-card__switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
