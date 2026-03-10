import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
    files?: Array<Express.Multer.File>,
  ) {
    try {
      const assetUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.filesService.uploadFile(file),
        );
        const urls = await Promise.all(uploadPromises);
        assetUrls.push(...urls);
      }

      const newPost = await this.prisma.post.create({
        data: {
          description: createPostDto.description,
          authorId: userId,
          assets: {
            create: assetUrls.map((url) => ({
              url,
              type: 'IMAGE',
            })),
          },
        },
        include: {
          assets: true,
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
        },
      });

      if (createPostDto.description) {
        const usernames = this.extractUsernames(createPostDto.description);
        if (usernames.length > 0) {
          await this.sendMentionNotifications(usernames, userId, newPost.id);
        }
      }

      this.logger.log(`Post created by user ${userId}, ID: ${newPost.id}`);
      return newPost;
    } catch (error) {
      this.logger.error('Failed to create post', (error as Error).stack);
      throw error;
    }
  }

  async getFeed(userId: string, pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'newest',
      mediaOnly = false,
    } = pagination;
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId, status: 'ACCEPTED' },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    const whereClause: Prisma.PostWhereInput = {
      authorId: { in: followingIds },
      isArchived: false,
      author: { deletedAt: null },
    };

    if (mediaOnly) {
      whereClause.assets = { some: {} };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy:
          sort === 'oldest'
            ? { createdAt: 'asc' }
            : sort === 'trending'
              ? { likes: { _count: 'desc' } }
              : { createdAt: 'desc' },
        include: {
          assets: true,
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      this.prisma.post.count({ where: whereClause }),
    ]);

    return { data: posts, meta: { total, page, limit } };
  }

  async findAll(pagination: PaginationDto, userId?: string) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'newest',
      mediaOnly = false,
      includeArchived = false,
      authorId,
      likedByUserId,
      commentedByUserId,
    } = pagination;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.PostWhereInput = {};

    // Only include archived posts if explicitly requested and for own posts
    if (!includeArchived) {
      whereClause.isArchived = false;
    } else if (includeArchived && userId && authorId && authorId !== userId) {
      // If requesting archived posts but for another user, don't include archived
      whereClause.isArchived = false;
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    if (likedByUserId) {
      whereClause.likes = { some: { authorId: likedByUserId } };
    }

    if (commentedByUserId) {
      whereClause.comments = { some: { authorId: commentedByUserId } };
    }

    if (search) {
      whereClause.description = { contains: search, mode: 'insensitive' };
    }

    if (mediaOnly) {
      whereClause.assets = { some: {} };
    }

    if (!authorId) {
      if (userId) {
        const acceptedFollowing = await this.prisma.follow.findMany({
          where: { followerId: userId, status: 'ACCEPTED' },
          select: { followingId: true },
        });
        const visibleAuthorIds = [
          userId,
          ...acceptedFollowing.map((f) => f.followingId),
        ];
        whereClause.OR = [
          {
            author: {
              deletedAt: null,
              profile: { isPrivate: false },
            },
          },
          {
            author: { deletedAt: null },
            authorId: { in: visibleAuthorIds },
          },
        ];
      } else {
        whereClause.author = {
          deletedAt: null,
          profile: { isPrivate: false },
        };
      }
    } else {
      whereClause.author = { deletedAt: null };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy:
          sort === 'oldest'
            ? { createdAt: 'asc' }
            : sort === 'trending'
              ? { likes: { _count: 'desc' } }
              : { createdAt: 'desc' },
        include: {
          assets: true,
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      this.prisma.post.count({ where: whereClause }),
    ]);

    return { data: posts, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
        author: { deletedAt: null },
      },
      include: {
        author: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: { select: { firstName: true, avatarUrl: true } },
          },
        },
        assets: true,
        _count: { select: { likes: true, comments: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            author: {
              select: {
                id: true,
                account: { select: { username: true } },
                profile: { select: { firstName: true, avatarUrl: true } },
              },
            },
          },
        },
      },
    });

    if (!post) {
      this.logger.warn(`Post ${id} not found`);
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
    files?: Array<Express.Multer.File>,
  ) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    try {
      // Delete specified assets
      if (
        updatePostDto.deleteAssetIds &&
        updatePostDto.deleteAssetIds.length > 0
      ) {
        await this.prisma.asset.deleteMany({
          where: {
            id: { in: updatePostDto.deleteAssetIds },
            postId: id,
          },
        });
      }

      // Upload new files
      const newAssetData: Array<{ url: string; type: 'IMAGE' | 'VIDEO' }> = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.filesService.uploadFile(file),
        );
        const urls = await Promise.all(uploadPromises);

        newAssetData.push(
          ...urls.map((url, index) => ({
            url,
            type: files[index].mimetype.startsWith('video/')
              ? ('VIDEO' as const)
              : ('IMAGE' as const),
          })),
        );
      }

      // Get current asset count after deletion
      const currentAssets = await this.prisma.asset.findMany({
        where: { postId: id },
      });

      // Check total limit (10 assets max)
      const totalAssets = currentAssets.length + newAssetData.length;
      if (totalAssets > 10) {
        throw new BadRequestException(
          `Maximum 10 assets allowed. Current: ${currentAssets.length}, New: ${newAssetData.length}`,
        );
      }

      // Update post with new description and assets
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          description: updatePostDto.description,
          ...(newAssetData.length > 0 && {
            assets: {
              create: newAssetData,
            },
          }),
        },
        include: {
          assets: true,
          author: {
            select: {
              id: true,
              account: { select: { username: true } },
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
        },
      });

      if (updatePostDto.description) {
        const oldMentions = this.extractUsernames(post.description || '');
        const newMentions = this.extractUsernames(updatePostDto.description);

        const mentionsToNotify = newMentions.filter(
          (username) => !oldMentions.includes(username),
        );

        if (mentionsToNotify.length > 0) {
          await this.sendMentionNotifications(mentionsToNotify, userId, id);
        }
      }

      this.logger.log(`Post ${id} updated by user ${userId}`);
      return updatedPost;
    } catch (error) {
      this.logger.error(`Failed to update post ${id}`, (error as Error).stack);
      throw error;
    }
  }

  async archive(id: string, userId: string) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only archive your own posts');
    }

    const newState = !post.isArchived;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: { isArchived: newState },
    });

    this.logger.log(
      `Post ${id} ${newState ? 'archived' : 'unarchived'} by user ${userId}`,
    );

    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    try {
      await this.prisma.post.delete({
        where: { id },
      });

      this.logger.log(`Post ${id} deleted by user ${userId}`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete post ${id}`, (error as Error).stack);
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
  ) {
    const accounts = await this.prisma.account.findMany({
      where: {
        OR: usernames.map((u) => ({
          username: { equals: u, mode: 'insensitive' },
        })),
      },
      select: { userId: true, username: true },
    });

    for (const account of accounts) {
      if (account.userId !== actorId) {
        await this.notificationService.create({
          type: NotificationType.MENTION,
          recipientId: account.userId,
          actorId: actorId,
          itemId: itemId,
          postId: itemId,
        });
      }
    }
  }
}
