import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
  user?: { phone: string };
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: UserRequest, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const phone = req.user?.phone;
      const maskedPhone = phone
        ? `${phone.slice(0, 3)}****${phone.slice(-2)}`
        : undefined;
      console.log(
        `${method} ${originalUrl} ${res.statusCode} ${duration}ms${maskedPhone ? ` user:${maskedPhone}` : ''}`,
      );
    });

    next();
  }
}
