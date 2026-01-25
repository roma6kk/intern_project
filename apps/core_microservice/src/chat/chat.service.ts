import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from '../database/prisma.service';
import { ChatType } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(currentUserId: string, createChatDto: CreateChatDto) {
    const uniqueMemberIds = new Set([
      ...createChatDto.memberIds,
      currentUserId,
    ]);
    const membersList = Array.from(uniqueMemberIds).map((id) => ({ id }));

    let type = createChatDto.type || ChatType.PRIVATE;

    if (uniqueMemberIds.size > 2) {
      type = ChatType.GROUP;
    }

    try {
      const chat = await this.prisma.chat.create({
        data: {
          type: type,
          name: createChatDto.name,
          members: {
            connect: membersList,
          },
        },
        include: {
          members: {
            select: {
              id: true,
              profile: {
                select: { firstName: true, secondName: true, avatarUrl: true },
              },
            },
          },
        },
      });

      this.logger.log(`Chat "${chat.id}" created by ${currentUserId}`);
      return chat;
    } catch (error) {
      this.logger.error('Failed to create chat', (error as Error).stack);
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
        (error as Error).stack,
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
      this.logger.error(`Failed to update chat ${id}`, (error as Error).stack);
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
      this.logger.error(`Failed to remove chat ${id}`, (error as Error).stack);
      throw error;
    }
  }
}
