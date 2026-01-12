import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(MessageService.name);

  async create(createMessageDto: CreateMessageDto) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          chat: {
            connect: { id: createMessageDto.chatId },
          },
          sender: {
            connect: { id: createMessageDto.senderId },
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              account: {
                select: { username: true },
              },
              profile: {
                select: {
                  firstName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      const username =
        newMessage.sender.account?.username || newMessage.sender.id;

      this.logger.log(
        `Message ${newMessage.id} created successfully by ${username}`,
      );

      return newMessage;
    } catch (error) {
      this.logger.error(`Failed to create new message in DB`, error.stack);
      throw error;
    }
  }

  async findAllBySender(senderId: string) {
    return this.prisma.message.findMany({
      where: { senderId },
      orderBy: { createdAt: 'asc' },
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
    });
  }

  async findAllByChat(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
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
    });
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { sender: true, chat: true },
    });

    if (!message) {
      this.logger.warn(`Message ${id} not found.`);
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);

    try {
      const updatedMessage = await this.prisma.message.update({
        where: { id },
        data: updateMessageDto,
      });

      this.logger.log(`Message ${id} updated successfully.`);
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Failed to update message ${id}`, error.stack);
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.prisma.message.delete({
        where: { id },
      });

      this.logger.log(`Message ${id} deleted successfully.`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete message ${id}`, error.stack);
      throw error;
    }
  }
}
