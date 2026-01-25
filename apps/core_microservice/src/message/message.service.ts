import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '../database/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { FilesService } from '../files/files.service';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
    private readonly filesService: FilesService,
  ) {}

  async create(
    senderId: string,
    createMessageDto: CreateMessageDto,
    files?: Array<Express.Multer.File>,
  ) {
    if (!createMessageDto.content && (!files || files.length === 0)) {
      throw new BadRequestException('Message must have content or attachments');
    }

    try {
      const assetUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.filesService.uploadFile(file),
        );
        assetUrls.push(...(await Promise.all(uploadPromises)));
      }

      const newMessage = await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          chat: { connect: { id: createMessageDto.chatId } },
          sender: { connect: { id: senderId } },

          assets: {
            create: assetUrls.map((url) => ({
              url,
              type: 'IMAGE',
            })),
          },
        },
        include: {
          sender: {
            select: {
              id: true,
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
          assets: true,
        },
      });

      this.chatGateway.sendNewMessage(createMessageDto.chatId, newMessage);

      this.logger.log(
        `Message ${newMessage.id} sent to chat ${createMessageDto.chatId}`,
      );
      return newMessage;
    } catch (error) {
      this.logger.error(`Failed to create message`, (error as Error).stack);
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
    const oldMessage = await this.findOne(id);

    try {
      const updatedMessage = await this.prisma.message.update({
        where: { id },
        data: {
          ...updateMessageDto,
          isEdited: true,
        },
        include: {
          sender: {
            select: {
              id: true,
              profile: { select: { firstName: true, avatarUrl: true } },
            },
          },
        },
      });

      this.chatGateway.sendMessageUpdate(oldMessage.chatId, updatedMessage);

      this.logger.log(`Message ${id} updated`);
      return updatedMessage;
    } catch (error) {
      this.logger.error(
        `Failed to update message ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async remove(id: string) {
    const message = await this.findOne(id);

    try {
      await this.prisma.message.delete({
        where: { id },
      });

      this.chatGateway.sendMessageDelete(message.chatId, id);

      this.logger.log(`Message ${id} deleted`);
      return { id, deleted: true };
    } catch (error) {
      this.logger.error(
        `Failed to delete message ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
