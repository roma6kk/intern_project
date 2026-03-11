import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../database/prisma.service';
import { FilesService } from '../files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType, Prisma } from '@prisma/client';
import { decodeCursor, encodeCursor } from '../common/utils/cursor.helper';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        account: { select: { username: true } };
        profile: { select: { firstName: true; avatarUrl: true } };
      };
    };
    assets: true;
    _count: { select: { likes: true; comments: true } };
    comments: {
      orderBy: { createdAt: 'desc' };
      take: 50;
      include: {
        author: {
          select: {
            id: true;
            account: { select: { username: true } };
            profile: { select: { firstName: true; avatarUrl: true } };
          };
        };
      };
    };
  };
}>;

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

      this.logger.log(`Post created by user ${userId}, ID:  ${newPost.id}`);

      return newPost;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create post', error.stack);
        throw error;
      }

      this.logger.error('Failed to create post', String(error));
      throw error;
    }
  }

  async getFeed(userId: string, pagination: PaginationDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'newest',
      mediaOnly = false,
      cursor,
    } = pagination;

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

    if (sort === 'trending') {
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy: { likes: { _count: 'desc' } },
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

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    }

    const take = limit + 1;
    const orderBy =
      sort === 'oldest'
        ? [{ createdAt: 'asc' as const }, { id: 'asc' as const }]
        : [{ createdAt: 'desc' as const }, { id: 'desc' as const }];

    let cursorFilter: Prisma.PostWhereInput | undefined;

    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      const createdAtDate = new Date(createdAt);

      if (sort === 'oldest') {
        cursorFilter = {
          OR: [
            { createdAt: { gt: createdAtDate } },
            {
              createdAt: createdAtDate,
              id: { gt: id },
            },
          ],
        };
      } else {
        cursorFilter = {
          OR: [
            { createdAt: { lt: createdAtDate } },
            {
              createdAt: createdAtDate,
              id: { lt: id },
            },
          ],
        };
      }
    }

    const [posts] = await Promise.all([
      this.prisma.post.findMany({
        where: cursorFilter
          ? { AND: [whereClause, cursorFilter] }
          : whereClause,
        take,
        orderBy,
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
    ]);

    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0, limit) : posts;

    const nextCursor =
      hasNextPage && items.length > 0
        ? encodeCursor({
            id: items[items.length - 1].id,
            createdAt: items[items.length - 1].createdAt.toISOString(),
          })
        : null;

    return {
      data: items,
      meta: {
        cursor: nextCursor,
        hasNextPage,
        limit,
      },
    };
  }

  async findAll(pagination: PaginationDto, userId?: string) {
    const {
      limit = 10,
      search,
      sort = 'newest',
      mediaOnly = false,
      includeArchived = false,
      authorId,
      likedByUserId,
      commentedByUserId,
      page = 1,
      cursor,
    } = pagination;

    const whereClause: Prisma.PostWhereInput = {};

    if (!includeArchived) {
      whereClause.isArchived = false;
    } else if (includeArchived && userId && authorId && authorId !== userId) {
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

    // Trending остаётся на offset-based пагинации
    if (sort === 'trending') {
      const skip = (page - 1) * limit;

      const [posts, total] = await Promise.all([
        this.prisma.post.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy: { likes: { _count: 'desc' } },
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

      const totalPages = Math.ceil(total / limit);

      return {
        data: posts,
        meta: {
          total,
          page,
          limit,
          totalPages,
        },
      };
    }

    const take = limit + 1;
    const orderBy =
      sort === 'oldest'
        ? [{ createdAt: 'asc' as const }, { id: 'asc' as const }]
        : [{ createdAt: 'desc' as const }, { id: 'desc' as const }];

    let cursorFilter: Prisma.PostWhereInput | undefined;

    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      const createdAtDate = new Date(createdAt);

      if (sort === 'oldest') {
        cursorFilter = {
          OR: [
            { createdAt: { gt: createdAtDate } },
            {
              createdAt: createdAtDate,
              id: { gt: id },
            },
          ],
        };
      } else {
        cursorFilter = {
          OR: [
            { createdAt: { lt: createdAtDate } },
            {
              createdAt: createdAtDate,
              id: { lt: id },
            },
          ],
        };
      }
    }

    const [posts] = await Promise.all([
      this.prisma.post.findMany({
        where: cursorFilter
          ? { AND: [whereClause, cursorFilter] }
          : whereClause,
        take,
        orderBy,
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
    ]);

    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0, limit) : posts;

    const nextCursor =
      hasNextPage && items.length > 0
        ? encodeCursor({
            id: items[items.length - 1].id,
            createdAt: items[items.length - 1].createdAt.toISOString(),
          })
        : null;

    return {
      data: items,
      meta: {
        cursor: nextCursor,
        hasNextPage,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const cacheKey = `post:${id}`;

    const cachedPost = await this.cacheManager.get<PostWithRelations>(cacheKey);
    if (cachedPost) {
      this.logger.log(`Cache hit for post ${id}`);
      return cachedPost;
    }

    this.logger.log(`Cache miss for post ${id}, querying database`);

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
    await this.cacheManager.set(cacheKey, post);
    this.logger.log(`Post ${id} cached in Redis`);
    return post;
  }

  async update(
    id: string,
    userId: string,
    updatePostDto: UpdatePostDto,
    files?: Array<Express.Multer.File>,
  ) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true, description: true },
    });

    if (!existingPost) throw new NotFoundException('Post not found');

    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    try {
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

      const currentAssetsCount = await this.prisma.asset.count({
        where: { postId: id },
      });

      const totalAssets = currentAssetsCount + newAssetData.length;
      if (totalAssets > 10) {
        throw new BadRequestException(
          `Maximum 10 assets allowed. Current: ${currentAssetsCount}, New: ${newAssetData.length}`,
        );
      }

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

      await this.cacheManager.del(`post:${id}`);

      if (updatePostDto.description) {
        const oldMentions = this.extractUsernames(
          existingPost.description || '',
        );
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to update post ${id}`, error.stack);
        throw error;
      }

      this.logger.error(`Failed to update post ${id}`, String(error));
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

    await this.cacheManager.del(`post:${id}`);

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

      await this.cacheManager.del(`post:${id}`);

      this.logger.log(`Post ${id} deleted by user ${userId}`);
      return { id, deleted: true };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to delete post ${id}`, error.stack);
        throw error;
      }

      this.logger.error(`Failed to delete post ${id}`, String(error));
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
    const accounts: Array<{ userId: string; username: string }> =
      await this.prisma.account.findMany({
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
