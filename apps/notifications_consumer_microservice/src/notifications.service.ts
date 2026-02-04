import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MailerService } from './mailer.service';

@Injectable()
export class NotificationsService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  
    constructor(private readonly mailerService: MailerService) {
      super();
    }
  
    async onModuleInit() {
      try {
        await this.$connect();
        this.logger.log('NotificationsService connected to database successfully');
      } catch (error) {
        this.logger.error('Failed to connect to database', (error as Error).stack);
        throw error;
      }
    }
  
    async onModuleDestroy() {
      try {
        await this.$disconnect();
        this.logger.log('NotificationsService disconnected from database');
      } catch (error) {
        this.logger.error('Error disconnecting from database', (error as Error).stack);
      }
    }
  

  async handleNotification(data: any) {
    try {
      this.logger.log(`Processing notification: type=${data.type}, recipientId=${data.recipientId}, actorId=${data.actorId}`);
      
      const savedNotification = await this.notification.create({
        data: {
          type: data.type,
          recipientId: data.recipientId,
          actorId: data.actorId,
          itemId: data.itemId,
        },
        include: { recipient: { include: { account: true } } }
      });

      this.logger.log(`Notification created successfully with ID: ${savedNotification.id}`);

      const email = savedNotification.recipient.account?.email;
      if (email) {
          await this.mailerService.sendEmail(
              email, 
              'New Notification', 
              `Type: ${data.type}`
          );
          this.logger.log(`Email sent successfully to ${email}`);
      } else {
          this.logger.warn(`User has no email, skipping sending.`);
      }
    } catch (error) {
      this.logger.error(
        `Error handling notification: type=${data.type}, recipientId=${data.recipientId}`,
        (error as Error).stack
      );
      throw error;
    }
  }
}