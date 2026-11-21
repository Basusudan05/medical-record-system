import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Vite will try 5173 first; if occupied it auto-increments to 5174, etc.
    // The proxy below applies regardless of which port Vite actually uses.
    port: 5173,
    proxy: {
      // All /api/* requests are forwarded to the Express backend.
      // Using a relative /api path in frontend code means CORS never applies —
      // the browser sees the request as same-origin.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
