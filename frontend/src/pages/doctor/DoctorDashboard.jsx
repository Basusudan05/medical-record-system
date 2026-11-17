import AppLayout from '../../components/layout/AppLayout';
import EmptyState from '../../components/common/EmptyState';
import { FolderOpen } from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <AppLayout role="doctor" title="Overview">
      <div>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          Doctor Dashboard
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          Scan a patient&apos;s QR code to access authorized records.
        </p>
        <EmptyState
          icon={FolderOpen}
          title="No authorized records"
          message="Scan a patient QR code to view records they have shared with you."
        />
      </div>
    </AppLayout>
  );
}
