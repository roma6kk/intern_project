import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(PostService.name);

  async create(createPostDto: CreatePostDto) {
    try {
      const newPost = await this.prisma.post.create({
        data: {
          description: createPostDto.description,
          author: {
            connect: { id: createPostDto.authorId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              account: {
                select: { username: true },
              },
              profile: {
                select: {
                  firstName: true,
                  secondName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      const authorName = newPost.author.account?.username || newPost.author.id;

      this.logger.log(`Post created by ${authorName}, ID: ${newPost.id}`);

      return newPost;
    } catch (error) {
      this.logger.error('Failed to create post', (error as Error).stack);
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Fetching all posts');
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            account: {
              select: { username: true },
            },
            profile: {
              select: {
                firstName: true,
                secondName: true,
                avatarUrl: true,
              },
            },
          },
        },
        // Можно сразу подтянуть ассеты (картинки), чтобы лента не была пустой
        assets: true,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            account: {
              select: { username: true },
            },
            profile: {
              select: {
                firstName: true,
                secondName: true,
                avatarUrl: true,
              },
            },
          },
        },
        assets: true,
        comments: {
          // ВАЖНО: Исправил вложенность для комментариев
          // Раньше возвращался весь юзер, теперь только профиль
          include: {
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
        },
      },
    });

    if (!post) {
      this.logger.warn(`Post ${id} not found`);
      throw new NotFoundException('Post not found');
    }

    this.logger.log(`Post ${post.id} found`);
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id); // Проверка существования

    try {
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          description: updatePostDto.description,
        },
      });

      this.logger.log(`Post ${updatedPost.id} updated`);
      return updatedPost;
    } catch (error) {
      this.logger.error(`Failed to update post ${id}`, (error as Error).stack);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.post.delete({
        where: { id },
      });

      this.logger.log(`Post ${id} deleted`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete post ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
