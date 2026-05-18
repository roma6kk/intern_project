import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import { AppController } from './app/app.controller';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { MetricsController } from './metrics/metrics.controller';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './redis/redis.module';
import { MetricsMiddleware } from './common/middleware/metrics.middleware';

const rootEnvPath = path.resolve(process.cwd(), '.env');
const localEnvPath = path.resolve(
  process.cwd(),
  'apps/auth_microservice/.env',
);

const envFilePaths = [
  fs.existsSync(rootEnvPath) ? rootEnvPath : undefined,
  fs.existsSync(localEnvPath) ? localEnvPath : undefined,
].filter(Boolean) as string[];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths.length > 0 ? envFilePaths : undefined,
    }),
    PrismaModule,
    RedisModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [MetricsMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
