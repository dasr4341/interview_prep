import { Request, Response, NextFunction } from 'express';
import { raw } from 'body-parser';

export function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.originalUrl.startsWith('/webhooks/stripe')) {
    raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
}
