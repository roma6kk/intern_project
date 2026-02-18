import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../database/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          content: createCommentDto.content,
          authorId: userId,
          postId: createCommentDto.postId,
          parentId: createCommentDto.parentId || null,
        },
        include: {
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
        },
      });

      let postOwnerId: string | undefined;

      if (createCommentDto.parentId) {
        const parentComment = await this.prisma.comment.findUnique({
          where: { id: createCommentDto.parentId },
          select: { authorId: true },
        });
        postOwnerId = parentComment?.authorId;
      } else {
        const post = await this.prisma.post.findUnique({
          where: { id: createCommentDto.postId },
          select: { authorId: true },
        });
        postOwnerId = post?.authorId;
      }

      if (postOwnerId && postOwnerId !== userId) {
        await this.notificationService.create({
          type: NotificationType.COMMENT,
          recipientId: postOwnerId,
          actorId: userId,
          itemId: comment.id,
          postId: createCommentDto.postId,
        });
      }

      const mentionedUsernames = this.extractUsernames(
        createCommentDto.content,
      );
      if (mentionedUsernames.length > 0) {
        const mentionsToNotify = mentionedUsernames;

        await this.sendMentionNotifications(
          mentionsToNotify,
          userId,
          comment.id,
          createCommentDto.postId,
          postOwnerId,
        );
      }

      this.logger.log(`Comment created. ID: ${comment.id}`);
      return comment;
    } catch (error) {
      this.logger.error('Failed to create comment', (error as Error).stack);
      throw error;
    }
  }

  async findByPostId(postId: string, pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          postId,
          parentId: null,
        },
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
          _count: {
            select: {
              likes: true,
              children: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where: { postId, parentId: null } }),
    ]);

    return { data: comments, meta: { total, page, limit } };
  }

  async findReplies(commentId: string) {
    return this.prisma.comment.findMany({
      where: { parentId: commentId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true } },
          },
        },
        _count: { select: { likes: true } },
      },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    try {
      const updated = await this.prisma.comment.update({
        where: { id },
        data: { content: updateCommentDto.content },
      });

      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update comment ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const comment = await this.findOne(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    try {
      await this.prisma.comment.delete({ where: { id } });
      this.logger.log(`Comment ${id} deleted`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(
        `Failed to delete comment ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  private extractUsernames(content: string): string[] {
    const usernames = new Set<string>();

    // react-mentions markup: @[display](id)
    const markupRegex = /@\[[^\]]+\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = markupRegex.exec(content)) !== null) {
      if (match[1]) {
        usernames.add(match[1]);
      }
    }

    // plain text mentions: @username
    const plainRegex = /@([\w.-_]+)/g;
    while ((match = plainRegex.exec(content)) !== null) {
      if (match[1]) {
        usernames.add(match[1]);
      }
    }

    return [...usernames];
  }

  private async sendMentionNotifications(
    usernames: string[],
    actorId: string,
    itemId: string,
    postId: string,
    excludeUserId?: string,
  ) {
    if (usernames.length === 0) return;

    const accounts = await this.prisma.account.findMany({
      where: {
        OR: usernames.map((u) => ({
          username: { equals: u, mode: 'insensitive' },
        })),
      },
      select: { userId: true, username: true },
    });

    for (const account of accounts) {
      if (account.userId !== actorId && account.userId !== excludeUserId) {
        await this.notificationService.create({
          type: NotificationType.MENTION,
          recipientId: account.userId,
          actorId: actorId,
          itemId: itemId,
          postId,
        });
      }
    }
  }
}
