import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';

const RECOVERY_WINDOW_DAYS = 30;

@Injectable()
export class PurgeDeletedUsersService {
  private readonly logger = new Logger(PurgeDeletedUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 3 * * *') // Every day at 3:00 AM
  async purgeExpiredDeletedUsers() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECOVERY_WINDOW_DAYS);

    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          deletedAt: { not: null, lt: cutoff },
        },
      });

      if (result.count > 0) {
        this.logger.log(`Purged ${result.count} expired deleted user(s)`);
      }
    } catch (error) {
      this.logger.error(
        'Failed to purge deleted users',
        (error as Error).stack,
      );
      throw error;
    }
  }
}
