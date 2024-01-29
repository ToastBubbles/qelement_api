import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers, query } = req;
    const timestamp = new Date().toISOString();

    this.logger.log(
      `${timestamp} - ${method} Request from ${ip} to ${originalUrl} with headers: ${JSON.stringify(
        headers,
      )} and query: ${JSON.stringify(query)}`,
    );
    next();
  }
}
