import { Router } from 'express';

const router = Router();

/**
 * QR sharing routes — implemented in Phase 9.
 * POST /api/qr/generate
 * GET  /api/qr/:token
 * POST /api/qr/:token/revoke
 */

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'QR sharing routes — implemented in Phase 9.',
  });
});

export default router;
