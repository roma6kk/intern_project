import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import cookieParser from 'cookie-parser';
import Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  Sentry.init({
    dsn: process.env.CORE_SENTRY_DSN ?? process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();

  app.useGlobalInterceptors(new SentryInterceptor());
  app.useWebSocketAdapter(redisIoAdapter);
  app.use(cookieParser());
  const frontendPublicUrl =
    process.env.FRONTEND_PUBLIC_URL ?? 'https://localhost';
  const allowedOrigins = new Set([
    frontendPublicUrl,
    'http://localhost:3002',
    'http://127.0.0.1:3002',
    'https://localhost',
  ]);

  app.enableCors({
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.has(origin));
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Innogram API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap().catch((error) => {
  Logger.error('Error starting Core Microservice', error);
  process.exit(1);
});
