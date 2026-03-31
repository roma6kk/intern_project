import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = Number(process.env.ASSISTANT_PORT ?? 3003);
  await app.listen(port);
  Logger.log(`Assistant microservice listening on ${port}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  Logger.error(err);
  process.exit(1);
});
