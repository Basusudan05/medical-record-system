import AppLayout from '../../components/layout/AppLayout';

export default function ScanQRPage() {
  return (
    <AppLayout role="doctor" title="Scan QR Code">
      <p style={{ color: 'var(--color-text-secondary)' }}>
        QR scanner — implemented in Phase 9.
      </p>
    </AppLayout>
  );
}
