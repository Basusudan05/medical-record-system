import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Droplets, Shield, Bell, LogOut, Save, AlertCircle } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import './ProfilePage.css';

const TABS = ['Personal details', 'Account settings', 'Notifications'];

export default function ProfilePage() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState('Personal details');
  const [form, setForm]             = useState(null);   // null = not loaded yet
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Populate form when profile is loaded
  useEffect(() => {
    if (profile) {
      setForm({
        full_name:     profile.full_name     || '',
        phone:         profile.phone         || '',
        date_of_birth: profile.date_of_birth || '',
        blood_group:   profile.blood_group   || 'O+',
        address:       profile.address       || '',
      });
    }
  }, [profile]);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setSaveError('');
    setSaveSuccess(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.full_name.trim()) { setSaveError('Full name is required.'); return; }

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name:     form.full_name.trim(),
        phone:         form.phone || null,
        date_of_birth: form.date_of_birth || null,
        blood_group:   form.blood_group || null,
        address:       form.address || null,
        updated_at:    new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setSaveError('Failed to save changes. Please try again.');
      console.error('[ProfilePage] update error:', error.message);
    } else {
      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  // Loading state while profile is being fetched
  if (!profile || !form) {
    return (
      <AppLayout role="patient" title="Profile">
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
          <LoadingSpinner size="lg" label="Loading profile…" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="patient" title="Profile">
      <div className="prof">
        {/* Header */}
        <div className="prof__header">
          <div className="prof__avatar">
            {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="prof__name">{profile.full_name}</h2>
            <p className="prof__meta">{profile.email} · {profile.role}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="prof__tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`prof__tab${activeTab === t ? ' prof__tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Personal details ── */}
        {activeTab === 'Personal details' && (
          <form className="prof__card" onSubmit={handleSave} noValidate>
            <div className="prof__section-title">Personal information</div>

            {saveError && (
              <div className="prof__alert prof__alert--error">
                <AlertCircle size={14} />
                <span>{saveError}</span>
              </div>
            )}
            {saveSuccess && (
              <div className="prof__alert prof__alert--success">
                Profile updated successfully.
              </div>
            )}

            <div className="prof__grid">
              <div className="prof__field">
                <label className="prof__label" htmlFor="full_name">Full name</label>
                <div className="prof__input-wrap">
                  <User size={14} className="prof__input-icon" />
                  <input
                    id="full_name" name="full_name" type="text"
                    value={form.full_name} onChange={handleChange}
                    className="prof__input prof__input--icon"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="email">Email address</label>
                <div className="prof__input-wrap">
                  <Mail size={14} className="prof__input-icon" />
                  <input
                    id="email" name="email" type="email"
                    value={profile.email}
                    className="prof__input prof__input--icon"
                    readOnly
                  />
                </div>
                <span className="prof__field-hint">Email cannot be changed here.</span>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="phone">Phone number</label>
                <div className="prof__input-wrap">
                  <Phone size={14} className="prof__input-icon" />
                  <input
                    id="phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="prof__input prof__input--icon"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="date_of_birth">Date of birth</label>
                <input
                  id="date_of_birth" name="date_of_birth" type="date"
                  value={form.date_of_birth} onChange={handleChange}
                  className="prof__input"
                  disabled={saving}
                />
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="blood_group">Blood group</label>
                <div className="prof__input-wrap">
                  <Droplets size={14} className="prof__input-icon" />
                  <select
                    id="blood_group" name="blood_group"
                    value={form.blood_group} onChange={handleChange}
                    className="prof__input prof__input--icon prof__select"
                    disabled={saving}
                  >
                    {['A+','A−','B+','B−','AB+','AB−','O+','O−'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="prof__field prof__field--full">
                <label className="prof__label" htmlFor="address">Address</label>
                <div className="prof__input-wrap">
                  <MapPin size={14} className="prof__input-icon" />
                  <input
                    id="address" name="address" type="text"
                    value={form.address} onChange={handleChange}
                    placeholder="Your address"
                    className="prof__input prof__input--icon"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div className="prof__actions">
              <button type="submit" className="prof__save-btn" disabled={saving}>
                <Save size={14} />
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {/* ── Account settings ── */}
        {activeTab === 'Account settings' && (
          <div className="prof__card">
            <div className="prof__section-title">Security</div>
            <div className="prof__setting-row">
              <div className="prof__setting-info">
                <div className="prof__setting-name"><Shield size={15} />Password</div>
                <div className="prof__setting-desc">Change your account password.</div>
              </div>
              <button className="prof__setting-btn">Change password</button>
            </div>

            <div className="prof__divider" />

            <div className="prof__section-title">Session</div>
            <div className="prof__setting-row">
              <div className="prof__setting-info">
                <div className="prof__setting-name" style={{ color: 'var(--color-error)' }}>
                  <LogOut size={15} />
                  Sign out
                </div>
                <div className="prof__setting-desc">
                  End your current session and return to the homepage.
                </div>
              </div>
              <button
                className="prof__setting-btn prof__setting-btn--danger"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeTab === 'Notifications' && (
          <div className="prof__card">
            <div className="prof__section-title">Email notifications</div>
            {[
              { key: 'upload', label: 'Document uploaded',    desc: 'When a new document is added to your account.' },
              { key: 'ai',     label: 'AI processing complete', desc: 'When AI extraction finishes on an uploaded document.' },
              { key: 'share',  label: 'Record accessed',      desc: 'When a doctor accesses your shared records via QR.' },
              { key: 'expiry', label: 'QR access expiring',   desc: '24 hours before a QR share link expires.' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="prof__notif-row">
                <div>
                  <div className="prof__notif-label">{label}</div>
                  <div className="prof__notif-desc">{desc}</div>
                </div>
                <label className="prof__toggle" aria-label={`Toggle ${label}`}>
                  <input type="checkbox" defaultChecked className="visually-hidden" />
                  <span className="prof__toggle-track">
                    <span className="prof__toggle-thumb" />
                  </span>
                </label>
              </div>
            ))}
            <p className="prof__placeholder-note">
              Notification delivery connected in Phase 3.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
