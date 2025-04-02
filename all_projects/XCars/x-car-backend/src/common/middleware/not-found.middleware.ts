import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const filePath = join(__dirname, '..', 'public', 'assets', req.path);
    if (!existsSync(filePath)) {
      next();
    }
  }
}
