import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(LikeService.name);

  async create(createLikeDto: CreateLikeDto) {
    try {
      const newLike = await this.prisma.like.create({
        data: {
          postId: createLikeDto.postId,
          authorId: createLikeDto.authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              account: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      const username = newLike.author.account?.username || newLike.authorId;

      this.logger.log(
        `Like ${newLike.id} created successfully by ${username}.`,
      );
      return newLike;
    } catch (error) {
      this.logger.error(`Failed to create like in DB`, error.stack);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.like.findMany();
  }

  async findByPostId(postId: string) {
    return this.prisma.like.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: { firstName: true, avatarUrl: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const like = await this.prisma.like.findUnique({
      where: { id },
    });

    if (!like) {
      this.logger.warn(`Like ${id} not found`);
      throw new NotFoundException('Like not found');
    }
    return like;
  }

  async update(id: string, updateLikeDto: UpdateLikeDto) {
    await this.findOne(id);

    try {
      const updatedLike = await this.prisma.like.update({
        where: { id },
        data: {
          authorId: updateLikeDto.authorId,
          postId: updateLikeDto.postId,
        },
      });
      this.logger.log(`Like ${id} updated successfully.`);
      return updatedLike;
    } catch (error) {
      this.logger.error(`Failed to update like ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.like.delete({
        where: { id },
      });
      this.logger.log(`Like ${id} deleted successfully.`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete like ${id}`, error.stack);
      throw error;
    }
  }
}
