import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, NotificationType } from '@prisma/client';
import { MailerService } from './mailer.service';
import { io, Socket } from 'socket.io-client';

interface NotificationData {
  type: NotificationType;
  recipientId: string;
  actorId: string;
  itemId?: string;
  postId?: string;
}

@Injectable()
export class NotificationsService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private socketClient: Socket | null = null;
  
    constructor(private readonly mailerService: MailerService) {
      super();
    }
  
    async onModuleInit() {
      try {
        await this.$connect();
        this.logger.log('NotificationsService connected to database successfully');
        
        const wsUrl = process.env.WS_URL;
        this.socketClient = io(`${wsUrl}/chat`, {
          transports: ['websocket'],
          reconnection: true,
        });
        
        this.socketClient.on('connect', () => {
          this.logger.log('Socket.IO client connected to ChatGateway');
        });
        
        this.socketClient.on('disconnect', () => {
          this.logger.warn('Socket.IO client disconnected');
        });
      } catch (error) {
        this.logger.error('Failed to connect to database', (error as Error).stack);
        throw error;
      }
    }
  
    async onModuleDestroy() {
      try {
        if (this.socketClient) {
          this.socketClient.disconnect();
        }
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

      if (this.socketClient?.connected) {
        this.socketClient.emit('send_notification', {
          recipientId: data.recipientId,
          notification: {
            id: savedNotification.id,
            type: savedNotification.type,
            itemId: savedNotification.itemId,
            postId: savedNotification.postId,
            createdAt: savedNotification.createdAt,
            actor: {
              id: savedNotification.actor.id,
              username: savedNotification.actor.account?.username,
              avatarUrl: savedNotification.actor.profile?.avatarUrl || null,
            }
          }
        });
        this.logger.log(`Socket notification sent to user_${data.recipientId}`);
      }

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
}
