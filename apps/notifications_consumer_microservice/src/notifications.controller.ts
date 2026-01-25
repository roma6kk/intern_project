import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('notification_created')
  async handleNotificationCreated(@Payload() data: any): Promise<void> {
    this.logger.log(`Received notification_created event: type=${data.type}, recipientId=${data.recipientId}, actorId=${data.actorId}`);
    try {
      await this.notificationsService.handleNotification(data);
      this.logger.log(`Successfully processed notification: type=${data.type}`);
    } catch (error) {
      this.logger.error(`Failed to process notification: type=${data.type}`, (error as Error).stack);
      throw error;
    }
  }
}