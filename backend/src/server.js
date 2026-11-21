import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Route modules
import healthRouter  from './routes/health.js';
import authRouter    from './routes/auth.js';
import recordsRouter from './routes/records.js';
import aiRouter      from './routes/ai.js';
import qrRouter      from './routes/qr.js';
import ocrRouter     from './routes/ocr.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────
// Allow Vite dev server on 5173 OR 5174 (Vite auto-increments if port is busy).
// In production, set FRONTEND_URL to your actual deployed domain.
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request logger ────────────────────────────────────────────────────
app.use(requestLogger);

// ── API Routes ────────────────────────────────────────────────────────
app.use('/api/health',  healthRouter);
app.use('/api/auth',    authRouter);
app.use('/api/records', recordsRouter);
app.use('/api/ai',      aiRouter);
app.use('/api/qr',      qrRouter);
app.use('/api/ocr',     ocrRouter);

// ── 404 & Error handlers ──────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 MediVault AI API`);
  console.log(`   Environment  : ${config.nodeEnv}`);
  console.log(`   Port         : ${config.port}`);
  console.log(`   OCR service  : ${config.ocrSpaceApiKey ? '✓ configured' : '✗ missing OCR_SPACE_API_KEY'}`);
  console.log(`   Health check : http://localhost:${config.port}/api/health\n`);
});

export default app;
