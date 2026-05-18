import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { restResponseTimeHistogram } from '../../utils/metrics';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const elapsedNs = process.hrtime.bigint() - start;
      const route = req.route?.path ?? req.path ?? req.url;
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route,
          status_code: res.statusCode,
        },
        Number(elapsedNs) / 1e9,
      );
    });

    next();
  }
}
