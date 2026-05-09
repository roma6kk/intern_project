import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '@prisma/client';

interface NotificationData {
  type: NotificationType;
  recipientId: string;
  actorId: string;
  itemId?: string;
  postId?: string;
  message?: string;
}

interface PasswordResetData {
  email: string;
  code: string;
  username?: string;
}

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notification_created')
  async handleNotificationCreated(@Payload() data: NotificationData): Promise<void> {
    this.logger.log(`Received notification_created event: type=${data.type}, recipientId=${data.recipientId}, actorId=${data.actorId}`);
    try {
      await this.notificationsService.handleNotification(data);
      this.logger.log(`Successfully processed notification: type=${data.type}`);
    } catch (error) {
      this.logger.error(`Failed to process notification: type=${data.type}`, (error as Error).stack);
      throw error;
    }
  }

  @EventPattern('password_reset_requested')
  async handlePasswordResetRequested(@Payload() data: PasswordResetData): Promise<void> {
    this.logger.log(`Received password_reset_requested event: email=${data.email}`);
    try {
      await this.notificationsService.sendPasswordResetCode(data);
      this.logger.log(`Password reset email sent: email=${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email: email=${data.email}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}