import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';

// Top-level error boundary — shows a readable message instead of a blank screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          background: '#f7f9fc',
          padding: '24px',
          textAlign: 'center',
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
          }}>
            <h2 style={{ color: '#dc2626', marginBottom: '12px', fontSize: '18px' }}>
              Application Error
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
              {this.state.error?.message || 'Something went wrong.'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '20px' }}>
              If this says &quot;Missing Supabase environment variables&quot; or the key looks wrong,
              update <code>frontend/.env</code> with the correct anon key from your
              Supabase dashboard (Project Settings → API → anon public).
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#0d9488',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
