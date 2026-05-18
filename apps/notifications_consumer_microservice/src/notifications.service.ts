import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, NotificationType } from '@prisma/client';
import { MailerService } from './mailer.service';

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
  

  async handleNotification(data: NotificationData) {
    try {
      this.logger.log(`Processing notification: type=${data.type}, recipientId=${data.recipientId}, actorId=${data.actorId}`);
      
      const savedNotification = await this.notification.create({
        data: {
          type: data.type,
          recipientId: data.recipientId,
          actorId: data.actorId,
          itemId: data.itemId,
          postId: data.postId || null,
          message: data.message ?? null,
        },
        include: { 
          recipient: { 
            include: { 
              account: true 
            } 
          },
          actor: {
            include: {
              account: true,
              profile: true
            }
          }
        }
      });

      this.logger.log(`Notification created successfully with ID: ${savedNotification.id}`);

      const email = savedNotification.recipient?.account?.email;
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

  async sendPasswordResetCode(data: PasswordResetData) {
    const username = data.username ? `, ${data.username}` : '';
    const text =
      `Здравствуйте${username}!\n\n` +
      `Ваш код для сброса пароля: ${data.code}\n` +
      'Код действителен 10 минут.\n' +
      'Если вы не запрашивали смену пароля, просто проигнорируйте это письмо.';

    await this.mailerService.sendEmail(
      data.email,
      'Восстановление пароля Innogram',
      text,
    );
  }
}
