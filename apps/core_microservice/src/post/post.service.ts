import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        description: createPostDto.description,
        author: {
          connect: { id: createPostDto.authorId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        assets: true,
        comments: {
          include: { author: true },
        },
      },
    });
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: {
        description: updatePostDto.description,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.post.findOne(id);
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
