import AppLayout from '../../components/layout/AppLayout';

export default function AuthorizedRecordsPage() {
  return (
    <AppLayout role="doctor" title="Patient Records">
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Authorized patient records — implemented in Phase 9.
      </p>
    </AppLayout>
  );
}
