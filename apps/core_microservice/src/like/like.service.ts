import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LikeService {
  private readonly logger = new Logger(LikeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(userId: string, targetId: string, type: 'POST' | 'COMMENT') {
    try {
      const whereCondition =
        type === 'POST'
          ? { postId: targetId, authorId: userId }
          : { commentId: targetId, authorId: userId };

      const existingLike = await this.prisma.like.findFirst({
        where: whereCondition,
      });

      if (existingLike) {
        await this.prisma.like.delete({
          where: { id: existingLike.id },
        });

        this.logger.log(`User ${userId} unliked ${type} ${targetId}`);
        return { liked: false, message: 'Unliked' };
      } else {
        await this.prisma.like.create({
          data: {
            authorId: userId,
            postId: type === 'POST' ? targetId : null,
            commentId: type === 'COMMENT' ? targetId : null,
          },
        });

        // TODO: Отправить уведомление автору контента (NotificationService)

        this.logger.log(`User ${userId} liked ${type} ${targetId}`);
        return { liked: true, message: 'Liked' };
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(`${type} with ID ${targetId} not found`);
        }
      }

      this.logger.error(
        `Failed to toggle like for ${type}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async getLikes(targetId: string, type: 'POST' | 'COMMENT') {
    const whereCondition =
      type === 'POST' ? { postId: targetId } : { commentId: targetId };

    return this.prisma.like.findMany({
      where: whereCondition,
      select: {
        createdAt: true,
        author: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: { firstName: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
