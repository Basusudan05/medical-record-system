import { Router } from 'express';

const router = Router();

/**
 * GET /api/health
 * Basic health-check endpoint — confirms the backend is running.
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'Smart Medical Record Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
