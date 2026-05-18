import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';
import { setSwaggerDocument } from './swagger-document';

const rootEnvPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
dotenv.config();

Sentry.init({
  dsn: process.env.AUTH_SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new SentryExceptionFilter());
  app.use(cookieParser());
  app.enableCors();

  const port = process.env.PORT ?? '3001';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Microservice API')
    .setDescription(
      'Authentication and authorization API for the Innogram platform',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .addServer(`http://localhost:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  setSwaggerDocument(document);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  Logger.log(`[Auth Service] Running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  Logger.error('Error starting server:', error);
  process.exit(1);
});
