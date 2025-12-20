import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto) {
    try {
      const chat = await this.prisma.chat.create({
        data: {
          members: {
            connect: createChatDto.memberIds.map((id) => ({ id })),
          },
        },
        include: {
          members: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  secondName: true,
                  avatarUrl: true,
                },
              },
              account: {
                select: { username: true },
              },
            },
          },
        },
      });

      this.logger.log(`Chat created successfully. ID: ${chat.id}`);
      return chat;
    } catch (error) {
      this.logger.error('Failed to create chat', error.stack);
      throw error;
    }
  }

  async findAllByUser(userId: string) {
    try {
      return await this.prisma.chat.findMany({
        where: {
          members: {
            some: { id: userId },
          },
        },
        include: {
          members: {
            select: {
              id: true,
              profile: {
                select: {
                  firstName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              createdAt: true,
              isRead: true,
              sender: {
                select: {
                  id: true,
                  profile: { select: { firstName: true } },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch chats for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            account: { select: { username: true } },
            profile: {
              select: {
                firstName: true,
                secondName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
          include: {
            sender: {
              select: {
                id: true,
                profile: {
                  select: { firstName: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!chat) {
      this.logger.warn(`Chat with ID ${id} not found`);
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    await this.findOne(id);

    try {
      const updatedChat = await this.prisma.chat.update({
        where: { id },
        data: {
          members: {
            connect: updateChatDto.addMemberIds?.map((id) => ({ id })),
            disconnect: updateChatDto.removeMemberIds?.map((id) => ({ id })),
          },
        },
        include: {
          members: {
            select: {
              id: true,
              profile: {
                select: { firstName: true, avatarUrl: true },
              },
            },
          },
        },
      });

      this.logger.log(`Chat ${id} updated successfully`);
      return updatedChat;
    } catch (error) {
      this.logger.error(`Failed to update chat ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.chat.delete({
        where: { id },
      });

      this.logger.log(`Chat ${id} removed successfully`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(`Failed to remove chat ${id}`, error.stack);
      throw error;
    }
  }
}
