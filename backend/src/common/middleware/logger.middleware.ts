import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const phone = (req as any).user?.phone;
      const maskedPhone = phone ? `${phone.slice(0, 3)}****${phone.slice(-2)}` : undefined;
      console.log(
        `${method} ${originalUrl} ${res.statusCode} ${duration}ms${maskedPhone ? ` user:${maskedPhone}` : ''}`,
      );
    });

    next();
  }
}
