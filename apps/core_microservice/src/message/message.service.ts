import {
  BadRequestException,
  ForbiddenException,
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

    if (createMessageDto.replyToId) {
      const replyTo = await this.prisma.message.findUnique({
        where: { id: createMessageDto.replyToId },
        select: { id: true, chatId: true },
      });
      if (!replyTo || replyTo.chatId !== createMessageDto.chatId) {
        throw new BadRequestException(
          'Reply must reference a message in the same chat',
        );
      }
    }

    try {
      const assetUrls: string[] = [];
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          this.filesService.uploadFile(file),
        );
        assetUrls.push(...(await Promise.all(uploadPromises)));
      }

      const chat = await this.prisma.chat.findUnique({
        where: { id: createMessageDto.chatId },
        select: { participants: { select: { userId: true } } },
      });

      const newMessage = await this.prisma.message.create({
        data: {
          content: createMessageDto.content,
          chat: { connect: { id: createMessageDto.chatId } },
          sender: { connect: { id: senderId } },
          ...(createMessageDto.replyToId && {
            replyTo: { connect: { id: createMessageDto.replyToId } },
          }),
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
              account: { select: { username: true } },
            },
          },
          assets: true,
          replyTo: {
            select: {
              id: true,
              content: true,
              deletedAt: true,
              senderId: true,
              sender: {
                select: {
                  id: true,
                  profile: { select: { firstName: true, avatarUrl: true } },
                  account: { select: { username: true } },
                },
              },
              assets: true,
            },
          },
        },
      });

      const memberIds = chat?.participants.map((p) => p.userId) || [];
      this.chatGateway.sendNewMessage(
        createMessageDto.chatId,
        newMessage,
        memberIds,
        senderId,
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
        assets: true,
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

  async update(
    id: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
    files?: Array<Express.Multer.File>,
  ) {
    const oldMessage = await this.findOne(id);
    if (oldMessage.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }
    if ((oldMessage as { deletedAt?: Date }).deletedAt) {
      throw new BadRequestException('Cannot edit a deleted message');
    }

    try {
      const data: { content?: string; isEdited: boolean } = {
        isEdited: true,
      };
      if (updateMessageDto.content !== undefined) {
        data.content = updateMessageDto.content;
      }

      let updatedMessage = await this.prisma.message.update({
        where: { id },
        data,
        include: {
          sender: {
            select: {
              id: true,
              profile: { select: { firstName: true, avatarUrl: true } },
              account: { select: { username: true } },
            },
          },
          assets: true,
        },
      });

      if (files && files.length > 0) {
        await this.prisma.asset.deleteMany({ where: { messageId: id } });
        const assetUrls = await Promise.all(
          files.map((file) => this.filesService.uploadFile(file)),
        );
        await this.prisma.asset.createMany({
          data: assetUrls.map((url) => ({
            url,
            type: 'IMAGE' as const,
            messageId: id,
          })),
        });
        updatedMessage = await this.prisma.message.findUniqueOrThrow({
          where: { id },
          include: {
            sender: {
              select: {
                id: true,
                profile: { select: { firstName: true, avatarUrl: true } },
                account: { select: { username: true } },
              },
            },
            assets: true,
          },
        });
      }

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

  async remove(id: string, userId: string) {
    const message = await this.findOne(id);
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    try {
      await this.prisma.asset.deleteMany({ where: { messageId: id } });
      const deletedMessage = await this.prisma.message.update({
        where: { id },
        data: { deletedAt: new Date(), content: null },
        include: {
          sender: {
            select: {
              id: true,
              profile: { select: { firstName: true, avatarUrl: true } },
              account: { select: { username: true } },
            },
          },
          assets: true,
        },
      });

      this.chatGateway.sendMessageDeleted(message.chatId, deletedMessage);

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

  async markChatAsRead(chatId: string, userId: string) {
    try {
      const result = await this.prisma.message.updateMany({
        where: {
          chatId,
          senderId: { not: userId },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return { count: result.count };
    } catch (error) {
      this.logger.error(
        `Failed to mark messages as read in chat ${chatId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
