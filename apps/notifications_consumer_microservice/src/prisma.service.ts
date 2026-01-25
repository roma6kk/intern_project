import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const url = configService.get<string>('DATABASE_URL');

    if (!url) {
      console.error('DATABASE_URL is required but not found in environment variables');
      throw new Error('DATABASE_URL is required but not found in environment variables');
    }

    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = url;
    }

    super({
      datasources: {
        db: {
          url: url,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected successfully');
    } catch (e) {
      this.logger.error('Prisma connection failed', e);
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}