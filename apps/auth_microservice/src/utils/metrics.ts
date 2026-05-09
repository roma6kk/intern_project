import client from 'prom-client';
import { Request, Response } from 'express';
import responseTime from 'response-time';

export const metricsMiddleware = responseTime((req: Request, res: Response, time: number) => {
  if(req.route?.path) {
    restResponseTimeHistogram.observe({
      method: req.method,
      route: req.route.path,
      status_code: res.statusCode,
    }, time / 1000);
  }
});

export const restResponseTimeHistogram = new client.Histogram({
  name: 'auth_service_http_request_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const collectDefaultMetrics = client.collectDefaultMetrics({
  prefix: 'auth_service_',
});

export const metricsEndpoint = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
};