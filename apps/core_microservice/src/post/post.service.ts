import {
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
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
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
              type: 'IMAGE', // Можно усложнить логику определения типа (видео/фото)
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

      this.logger.log(`Post created by user ${userId}, ID: ${newPost.id}`);
      return newPost;
    } catch (error) {
      this.logger.error('Failed to create post', (error as Error).stack);
      throw error;
    }
  }

  async getFeed(userId: string, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    const whereClause = {
      authorId: { in: followingIds },
      isArchived: false,
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
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

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.PostWhereInput = { isArchived: false };

    if (search) {
      whereClause.description = { contains: search, mode: 'insensitive' };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { createdAt: 'desc' },
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
    const post = await this.prisma.post.findUnique({
      where: { id },
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

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    try {
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          description: updatePostDto.description,
        },
        include: { assets: true },
      });

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

    return this.prisma.post.update({
      where: { id },
      data: { isArchived: true },
    });
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
}
