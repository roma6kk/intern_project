import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/prisma';
import './config/redis';
import './config/passport';
import routes from './routes/auth.routes';
import { collectDefaultMetrics } from 'prom-client';
import { metricsEndpoint, metricsMiddleware } from './utils/metrics';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

const app = express();

const PORT = process.env.PORT;

collectDefaultMetrics();

app.use(metricsMiddleware);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Microservice API',
      version: '1.0.0',
      description: 'Authentication and authorization API for the Innogram platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error in Auth Service!');
});

app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/metrics', metricsEndpoint);

app.use('/internal/auth', routes);

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`[Auth Service] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

Sentry.setupExpressErrorHandler(app);

start();