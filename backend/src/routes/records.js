import { Router } from 'express';

const router = Router();

/**
 * Medical record routes — implemented in Phase 4.
 * GET    /api/records
 * POST   /api/records
 * GET    /api/records/:id
 * DELETE /api/records/:id
 */

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Medical record routes — implemented in Phase 4.',
  });
});

export default router;
