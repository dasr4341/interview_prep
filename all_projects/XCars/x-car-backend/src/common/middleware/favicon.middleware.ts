import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FaviconMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url == '/favicon.ico') {
      res.status(204).end(); // Respond with a 204 No Content status
    } else {
      next();
    }
  }
}
