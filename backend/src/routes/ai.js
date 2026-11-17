import { Router } from 'express';

const router = Router();

/**
 * AI processing routes — implemented in Phase 5.
 * POST /api/ai/process-prescription
 * POST /api/ai/analyze-report
 * POST /api/ai/assistant
 */

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI processing routes — implemented in Phase 5.',
  });
});

export default router;
