import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

const RECOVERY_WINDOW_DAYS = 30;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async isDeleted(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { deletedAt: true },
    });
    return user?.deletedAt != null;
  }

  async softDeleteProfile(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
      this.logger.log(`User ${userId} soft-deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Error soft-deleting user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async recoverProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { deletedAt: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.deletedAt) {
      throw new BadRequestException('Account is not scheduled for deletion');
    }

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RECOVERY_WINDOW_DAYS);
    if (user.deletedAt < cutoff) {
      throw new BadRequestException('Recovery window has expired');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });
    this.logger.log(`User ${userId} recovered successfully`);
  }

  async getCurrentUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          account: {
            select: {
              email: true,
              username: true,
              phoneNumber: true,
            },
          },
          profile: true,
        },
      });

      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
