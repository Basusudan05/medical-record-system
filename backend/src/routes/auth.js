import { Router } from 'express';

const router = Router();

/**
 * Auth routes — implemented in Phase 2.
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 */

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes — implemented in Phase 2.',
  });
});

export default router;
