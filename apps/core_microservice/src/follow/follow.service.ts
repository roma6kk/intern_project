import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FollowStatus, NotificationType } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FollowService {
  private readonly logger = new Logger(FollowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async follow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    try {
      const targetUser = await this.prisma.user.findUnique({
        where: { id: targetUserId },
        include: { profile: true },
      });

      if (!targetUser) {
        throw new NotFoundException('User not found');
      }

      const existingFollow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId: targetUserId,
          },
        },
      });

      if (existingFollow) {
        throw new BadRequestException(
          existingFollow.status === 'PENDING'
            ? 'Request already sent'
            : 'Already following',
        );
      }

      const isPrivate = targetUser.profile?.isPrivate ?? false;
      const status: FollowStatus = isPrivate ? 'PENDING' : 'ACCEPTED';

      await this.prisma.follow.create({
        data: {
          followerId,
          followingId: targetUserId,
          status,
        },
      });

      await this.notificationService.create({
        type: NotificationType.FOLLOW,
        recipientId: targetUserId,
        actorId: followerId,
      });

      const message =
        status === 'PENDING' ? 'Follow request sent' : 'Successfully followed';

      this.logger.log(`User ${followerId} -> ${targetUserId}: ${status}`);

      return { status, message };
    } catch (error) {
      this.logger.error('Failed to follow user', (error as Error).stack);
      throw error;
    }
  }

  async unfollow(followerId: string, targetUserId: string) {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: targetUserId,
          },
        },
      });

      this.logger.log(`User ${followerId} unfollowed ${targetUserId}`);
      return { message: 'Unfollowed successfully' };
    } catch (error) {
      this.logger.error('Failed to unfollow', (error as Error).stack);
      throw new NotFoundException('Follow relationship not found');
    }
  }

  async acceptRequest(currentUserId: string, followerId: string) {
    try {
      const request = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId: currentUserId,
          },
        },
      });

      if (!request || request.status !== 'PENDING') {
        throw new NotFoundException('No pending request found');
      }

      await this.prisma.follow.update({
        where: { id: request.id },
        data: { status: 'ACCEPTED' },
      });

      // Отправляем уведомление фолловеру, что его запрос принят
      await this.notificationService.create({
        type: NotificationType.FOLLOW,
        recipientId: followerId,
        actorId: currentUserId,
      });

      this.logger.log(`User ${currentUserId} accepted follower ${followerId}`);
      return { message: 'Request accepted' };
    } catch (error) {
      this.logger.error('Failed to accept request', (error as Error).stack);
      throw error;
    }
  }

  async removeFollower(currentUserId: string, followerId: string) {
    try {
      await this.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: currentUserId,
          },
        },
      });

      this.logger.log(`User ${currentUserId} removed follower ${followerId}`);
      return { message: 'Follower removed' };
    } catch (error) {
      this.logger.error('Failed to remove follower', (error as Error).stack);
      throw new NotFoundException('Follower not found');
    }
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingId: userId,
        status: 'ACCEPTED',
      },
      select: {
        follower: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, secondName: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followerId: userId,
        status: 'ACCEPTED',
      },
      select: {
        following: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, secondName: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.follow.findMany({
      where: {
        followingId: userId,
        status: 'PENDING',
      },
      select: {
        follower: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, secondName: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }
}
