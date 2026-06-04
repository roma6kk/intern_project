import client from 'prom-client';

export const restResponseTimeHistogram = new client.Histogram({
  name: 'auth_service_http_request_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

client.collectDefaultMetrics({
  prefix: 'auth_service_',
});
