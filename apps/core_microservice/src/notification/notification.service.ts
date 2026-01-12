import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          type: createNotificationDto.type,
          itemId: createNotificationDto.itemId,
          recipient: {
            connect: { id: createNotificationDto.recipientId },
          },
          actor: {
            connect: { id: createNotificationDto.actorId },
          },
        },
      });

      this.logger.log(
        `Notification created successfully. ID: ${notification.id}`,
      );
      return notification;
    } catch (error) {
      this.logger.error(
        'Failed to create notification',
        (error as Error).stack,
      );
      throw error;
    }
  }

  async findAll() {
    const notifications = await this.prisma.notification.findMany();
    this.logger.log(`Retrieved ${notifications.length} notifications`);
    return notifications;
  }

  async findByRecipient(recipientId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
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
      },
    });
    this.logger.log(
      `Retrieved ${notifications.length} notifications for user ${recipientId}`,
    );
    return notifications;
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
