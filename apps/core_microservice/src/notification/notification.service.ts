import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log(
        'NotificationService: RabbitMQ client connected successfully',
      );
    } catch (error) {
      this.logger.error(
        'NotificationService: Failed to connect RabbitMQ client',
        (error as Error).stack,
      );
    }
  }

  async create(dto: CreateNotificationDto) {
    if (dto.actorId === dto.recipientId) {
      this.logger.debug(
        `Skipping notification: actor and recipient are the same (${dto.actorId})`,
      );
      return;
    }

    try {
      this.logger.log(
        `Sending notification event to queue: type=${dto.type}, recipientId=${dto.recipientId}, actorId=${dto.actorId}, itemId=${dto.itemId}`,
      );
      this.client.emit('notification_created', dto).subscribe({
        next: () => {
          this.logger.log(
            `Notification event sent successfully: type=${dto.type}`,
          );
        },
        error: (error) => {
          this.logger.error(
            `Failed to send notification event: type=${dto.type}`,
            (error as Error).stack,
          );
        },
      });
    } catch (error) {
      this.logger.error(
        `Error emitting notification event: type=${dto.type}`,
        (error as Error).stack,
      );
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
