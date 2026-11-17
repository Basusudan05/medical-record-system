import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Clock, FileText } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import DocTypeBadge from '../../components/common/DocTypeBadge';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { MOCK_RECORDS } from '../../data/mockData';
import './MedicalHistoryPage.css';

const FILTERS = [
  { value: '', label: 'All Records' },
  { value: 'prescription', label: 'Prescriptions' },
  { value: 'blood_report', label: 'Blood Reports' },
  { value: 'xray',         label: 'X-Ray Reports' },
  { value: 'discharge',    label: 'Discharge Summaries' },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function MedicalHistoryPage() {
  const [activeFilter, setActiveFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return MOCK_RECORDS.filter(r => {
      const matchType = !activeFilter || r.document_type === activeFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        r.document_name.toLowerCase().includes(q) ||
        r.doctor_name.toLowerCase().includes(q) ||
        r.hospital.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [activeFilter, search]);

  return (
    <AppLayout role="patient" title="Medical History">
      <div className="mh">
        {/* Header */}
        <div className="mh__header">
          <div>
            <h2 className="mh__title">Medical History</h2>
            <p className="mh__subtitle">
              {MOCK_RECORDS.length} records · all your uploaded documents in one place.
            </p>
          </div>
          <Link to="/patient/upload" className="mh__upload-btn">
            + Upload document
          </Link>
        </div>

        {/* Controls */}
        <div className="mh__controls">
          {/* Search */}
          <div className="mh__search">
            <Search size={14} className="mh__search-icon" />
            <input
              type="search"
              placeholder="Search by name, doctor, or hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mh__search-input"
            />
          </div>

          {/* Category filters */}
          <div className="mh__filters">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`mh__filter-btn${activeFilter === f.value ? ' mh__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="mh__empty">
            <EmptyState
              icon={FileText}
              title="No records found"
              message="Try a different search or category filter."
            />
          </div>
        ) : (
          <div className="mh__table-wrap">
            <table className="mh__table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Doctor / Hospital</th>
                  <th>Date</th>
                  <th>AI Status</th>
                  <th>Verification</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <span className="mh__doc-name">{rec.document_name}</span>
                      {rec.notes && (
                        <span className="mh__doc-notes">{rec.notes}</span>
                      )}
                    </td>
                    <td><DocTypeBadge type={rec.document_type} /></td>
                    <td>
                      <span className="mh__doctor">{rec.doctor_name}</span>
                      <span className="mh__hospital">{rec.hospital}</span>
                    </td>
                    <td>
                      <span className="mh__date">
                        <Clock size={11} />
                        {formatDate(rec.upload_date)}
                      </span>
                    </td>
                    <td><StatusBadge status={rec.processing_status} /></td>
                    <td><StatusBadge status={rec.verification_status} /></td>
                    <td>
                      <Link to={`/patient/records/${rec.id}`} className="mh__view-link">
                        View <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Count line */}
        {filtered.length > 0 && (
          <p className="mh__count">
            Showing {filtered.length} of {MOCK_RECORDS.length} records
          </p>
        )}
      </div>
    </AppLayout>
  );
}
