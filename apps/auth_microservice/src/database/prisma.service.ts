import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      Logger.log('[Prisma] Database connected successfully');
    } catch (error) {
      Logger.error('[Prisma] Connection failed', error);
      process.exit(1);
    }
  }
}
