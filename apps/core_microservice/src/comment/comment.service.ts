import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          author: {
            connect: { id: createCommentDto.authorId },
          },
          post: {
            connect: { id: createCommentDto.postId },
          },
          content: createCommentDto.content,
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

      this.logger.log(`Comment created successfully. ID: ${comment.id}`);
      return comment;
    } catch (error) {
      this.logger.error('Failed to create comment', error.stack);
      throw error;
    }
  }

  async findAll() {
    const comments = await this.prisma.comment.findMany();
    this.logger.log(`Retrieved ${comments.length} comments`);
    return comments;
  }

  async findByPost(postId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { postId: postId },
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
    });
    this.logger.log(`Retrieved ${comments.length} comments for post ${postId}`);
    return comments;
  }

  async findByUser(userId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        authorId: userId,
      },
    });
    this.logger.log(`Retrieved ${comments.length} comments for user ${userId}`);
    return comments;
  }

  async findOne(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      this.logger.warn(`Comment with ID ${commentId} not found`);
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(commentId: string, updateCommentDto: UpdateCommentDto) {
    await this.findOne(commentId);

    try {
      const updatedComment = await this.prisma.comment.update({
        where: { id: commentId },
        data: {
          content: updateCommentDto.content,
        },
      });

      this.logger.log(`Comment ${commentId} updated successfully`);
      return updatedComment;
    } catch (error) {
      this.logger.error(`Failed to update comment ${commentId}`, error.stack);
      throw error;
    }
  }

  async remove(commentId: string) {
    await this.findOne(commentId);

    try {
      const deletedComment = await this.prisma.comment.delete({
        where: { id: commentId },
      });

      this.logger.log(`Comment ${commentId} removed successfully`);
      return deletedComment;
    } catch (error) {
      this.logger.error(`Failed to remove comment ${commentId}`, error.stack);
      throw error;
    }
  }
}
