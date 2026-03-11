import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../database/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { PaginationDto } from '../common/dto/pagination.dto';
import { decodeCursor, encodeCursor } from '../common/utils/cursor.helper';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
    private readonly chatGateway: ChatGateway,
  ) {}

  async create(dto: CreateNotificationDto) {
    if (dto.actorId === dto.recipientId) {
      return;
    }

    try {
      this.client.emit('notification_created', dto);

      const actor = await this.prisma.user.findUnique({
        where: { id: dto.actorId },
        include: { account: { select: { username: true } }, profile: true },
      });

      this.chatGateway.sendNotification(dto.recipientId, {
        type: dto.type,
        itemId: dto.itemId,
        postId: dto.postId,
        actor: {
          username: actor?.account?.username,
          avatarUrl: actor?.profile?.avatarUrl,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error sending notification: type=${dto.type}`,
        (error as Error).stack,
      );
    }
  }

  async findAll() {
    const notifications = await this.prisma.notification.findMany();
    this.logger.log(`Retrieved ${notifications.length} notifications`);
    return notifications;
  }

  async findByRecipient(recipientId: string, pagination?: PaginationDto) {
    const limit = pagination?.limit ?? 20;
    const cursor = pagination?.cursor;

    const take = limit + 1;

    let cursorFilter: Prisma.NotificationWhereInput | undefined;

    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      const createdAtDate = new Date(createdAt);

      cursorFilter = {
        OR: [
          { createdAt: { lt: createdAtDate } },
          {
            createdAt: createdAtDate,
            id: { lt: id },
          },
        ],
      };
    }

    const notifications = await this.prisma.notification.findMany({
      where: cursorFilter
        ? { recipientId, AND: cursorFilter }
        : { recipientId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      include: {
        actor: {
          select: {
            id: true,
            account: {
              select: {
                username: true,
              },
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

    const hasNextPage = notifications.length > limit;
    const items = hasNextPage ? notifications.slice(0, limit) : notifications;

    const nextCursor =
      hasNextPage && items.length > 0
        ? encodeCursor({
            id: items[items.length - 1].id,
            createdAt: items[items.length - 1].createdAt.toISOString(),
          })
        : null;

    return {
      data: items,
      meta: {
        cursor: nextCursor,
        hasNextPage,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      this.logger.warn(`Notification with ID ${id} not found`);
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id);

    try {
      const updatedNotification = await this.prisma.notification.update({
        where: { id },
        data: updateNotificationDto,
      });

      this.logger.log(`Notification ${id} updated successfully`);
      return updatedNotification;
    } catch (error) {
      this.logger.error(
        `Failed to update notification ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const deletedNotification = await this.prisma.notification.delete({
        where: { id },
      });

      this.logger.log(`Notification ${id} removed successfully`);
      return deletedNotification;
    } catch (error) {
      this.logger.error(
        `Failed to remove notification ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
