import { validationResult } from 'express-validator';

/**
 * Runs after express-validator chains.
 * Returns a 422 response if any validation errors exist.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
}
