import { useState } from 'react';
import { User, Mail, Phone, MapPin, Droplets, Shield, Bell, LogOut, Save } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import { MOCK_USER } from '../../data/mockData';
import './ProfilePage.css';

const TABS = ['Personal details', 'Account settings', 'Notifications'];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal details');
  const [form, setForm] = useState({
    full_name: MOCK_USER.full_name,
    email: MOCK_USER.email,
    phone: MOCK_USER.phone,
    address: MOCK_USER.address,
    date_of_birth: MOCK_USER.date_of_birth,
    blood_group: MOCK_USER.blood_group,
  });
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSave(e) {
    e.preventDefault();
    // Persist via API in Phase 3
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <AppLayout role="patient" title="Profile">
      <div className="prof">
        {/* Page header */}
        <div className="prof__header">
          <div className="prof__avatar">
            {MOCK_USER.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="prof__name">{MOCK_USER.full_name}</h2>
            <p className="prof__meta">{MOCK_USER.email} · Patient</p>
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

        {/* Personal details */}
        {activeTab === 'Personal details' && (
          <form className="prof__card" onSubmit={handleSave} noValidate>
            <div className="prof__section-title">Personal information</div>
            <div className="prof__grid">
              <div className="prof__field">
                <label className="prof__label" htmlFor="full_name">Full name</label>
                <div className="prof__input-wrap">
                  <User size={14} className="prof__input-icon" />
                  <input
                    id="full_name" name="full_name" type="text"
                    value={form.full_name} onChange={handleChange}
                    className="prof__input prof__input--icon"
                  />
                </div>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="email">Email address</label>
                <div className="prof__input-wrap">
                  <Mail size={14} className="prof__input-icon" />
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    className="prof__input prof__input--icon"
                    readOnly
                  />
                </div>
                <span className="prof__field-hint">Email cannot be changed here. Contact support.</span>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="phone">Phone number</label>
                <div className="prof__input-wrap">
                  <Phone size={14} className="prof__input-icon" />
                  <input
                    id="phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange}
                    className="prof__input prof__input--icon"
                  />
                </div>
              </div>

              <div className="prof__field">
                <label className="prof__label" htmlFor="date_of_birth">Date of birth</label>
                <input
                  id="date_of_birth" name="date_of_birth" type="date"
                  value={form.date_of_birth} onChange={handleChange}
                  className="prof__input"
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
                    className="prof__input prof__input--icon"
                  />
                </div>
              </div>
            </div>

            <div className="prof__actions">
              <button type="submit" className="prof__save-btn">
                <Save size={14} />
                {saved ? 'Saved!' : 'Save changes'}
              </button>
            </div>
          </form>
        )}

        {/* Account settings */}
        {activeTab === 'Account settings' && (
          <div className="prof__card">
            <div className="prof__section-title">Security</div>
            <div className="prof__setting-row">
              <div className="prof__setting-info">
                <div className="prof__setting-name">
                  <Shield size={15} />
                  Password
                </div>
                <div className="prof__setting-desc">Last changed · Unknown</div>
              </div>
              <button className="prof__setting-btn">Change password</button>
            </div>
            <div className="prof__setting-row">
              <div className="prof__setting-info">
                <div className="prof__setting-name">
                  <Shield size={15} />
                  Two-factor authentication
                </div>
                <div className="prof__setting-desc">Not enabled</div>
              </div>
              <button className="prof__setting-btn">Enable 2FA</button>
            </div>

            <div className="prof__divider" />

            <div className="prof__section-title">Danger zone</div>
            <div className="prof__setting-row">
              <div className="prof__setting-info">
                <div className="prof__setting-name" style={{ color: 'var(--color-error)' }}>
                  <LogOut size={15} />
                  Sign out of all devices
                </div>
                <div className="prof__setting-desc">
                  You will be logged out from every active session.
                </div>
              </div>
              <button className="prof__setting-btn prof__setting-btn--danger">Sign out all</button>
            </div>

            <p className="prof__placeholder-note">
              Full account management connected in Phase 3 (authentication).
            </p>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'Notifications' && (
          <div className="prof__card">
            <div className="prof__section-title">Email notifications</div>
            {[
              { key: 'upload', label: 'Document uploaded', desc: 'When a new document is added to your account.' },
              { key: 'ai', label: 'AI processing complete', desc: 'When AI extraction finishes on an uploaded document.' },
              { key: 'share', label: 'Record accessed', desc: 'When a doctor accesses your shared records via QR.' },
              { key: 'expiry', label: 'QR access expiring', desc: '24 hours before a QR share link expires.' },
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
