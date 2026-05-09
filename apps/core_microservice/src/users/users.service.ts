import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AccountState } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';

const RECOVERY_WINDOW_DAYS = 30;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async isDeleted(userId: string): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { state: true },
    });
    return account?.state === AccountState.DELETED;
  }

  async getAccountState(userId: string): Promise<AccountState | null> {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { state: true },
    });
    return account?.state ?? null;
  }

  async getAccountAccessMeta(userId: string): Promise<{
    state: AccountState | null;
    suspendedUntil: Date | null;
  }> {
    const account = await this.prisma.account.findUnique({
      where: { userId },
      select: { state: true, suspendedUntil: true },
    });
    return {
      state: account?.state ?? null,
      suspendedUntil: account?.suspendedUntil ?? null,
    };
  }

  async softDeleteProfile(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
      await this.prisma.account.update({
        where: { userId },
        data: {
          state: AccountState.DELETED,
          stateChangedAt: new Date(),
          stateReason: 'USER_SELF_DELETE',
          deletionRequestedAt: new Date(),
          recoveryDeadline: new Date(
            Date.now() + RECOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000,
          ),
        },
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
    await this.prisma.account.update({
      where: { userId },
      data: {
        state: AccountState.ACTIVE,
        stateChangedAt: new Date(),
        stateReason: 'USER_RECOVER',
        deletionRequestedAt: null,
        recoveryDeadline: null,
      },
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
              role: true,
              state: true,
              suspendedUntil: true,
            },
          },
          profile: true,
        },
      });

      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException('User not found');
      }

      // Ensure avatarUrl is readable from browser (signed URL for private buckets)
      if (user.profile?.avatarUrl) {
        const readable = await this.filesService.getReadableUrl(
          user.profile.avatarUrl,
        );
        return { ...user, profile: { ...user.profile, avatarUrl: readable } };
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
