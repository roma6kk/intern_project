import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { WsAuthGuard } from '../auth/guards/ws-auth.guard';
import { ICurrentUser } from '../auth/interfaces/ICurrentUser';
import type { IAuthenticatedSocket } from './interfaces/IAuthenticatedSocket';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: ICurrentUser;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private redisClient: RedisClientType;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );

    this.redisClient = createClient({ url: redisUrl });

    this.redisClient.on('error', (err) =>
      this.logger.error('Redis Client Error', err),
    );

    await this.redisClient.connect();
    this.startHeartbeat();
    this.logger.log(
      `Online Status Redis connected to ${redisUrl}. Cleaned up online_users.`,
    );
  }

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
  }

  private startHeartbeat() {
    setInterval(() => {
      void (async () => {
        const now = Date.now();

        const threshold = now - 60000;
        await this.redisClient.zRemRangeByScore(
          'online_users_zset',
          0,
          threshold,
        );

        const sockets = await this.server.local.fetchSockets();
        if (sockets.length === 0) return;

        const activeUserIds = new Set<string>();
        for (const socket of sockets) {
          const socketData = socket.data as { user?: ICurrentUser };
          const userId = socketData.user?.userId;
          if (userId) activeUserIds.add(userId);
        }

        const multi = this.redisClient.multi();
        for (const userId of activeUserIds) {
          multi.zAdd('online_users_zset', { score: now, value: userId });
        }
        await multi.exec();
      })();
    }, 30000);
  }

  async handleConnection(client: IAuthenticatedSocket) {
    try {
      const authPayload = client.handshake.auth as { token?: string };

      const token = this.extractToken(client) || authPayload.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} tried to connect without token`);
        client.disconnect();
        return;
      }

      const user = await this.authService.validateToken(token);
      client.data.user = user;
      await client.join(`user_${user.userId}`);

      await this.redisClient.zAdd('online_users_zset', {
        score: Date.now(),
        value: user.userId,
      });

      this.logger.log(`User ${user.username} is ONLINE`);
    } catch {
      this.logger.error(`Connection rejected for ${client.id}: Invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: IAuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`chat_${chatId}`);
    this.logger.log(`Client ${client.id} joined room chat_${chatId}`);
    return { event: 'joined_chat', data: { chatId } };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @MessageBody('chatId') chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`chat_${chatId}`);
    return { event: 'left_chat', data: { chatId } };
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { chatId: string; isTyping: boolean },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const user = client.data.user;

    if (!user) return;

    client.to(`chat_${data.chatId}`).emit('user_typing', {
      userId: user.userId,
      username: user.username,
      isTyping: data.isTyping,
      chatId: data.chatId,
    });
  }

  async getOnlineUsers(): Promise<string[]> {
    const now = Date.now();
    const threshold = now - 60000;

    await this.redisClient.zRemRangeByScore('online_users_zset', 0, threshold);

    return this.redisClient.zRange('online_users_zset', 0, -1);
  }

  sendNewMessage(chatId: string, message: unknown) {
    this.server.to(`chat_${chatId}`).emit('new_message', message);
  }

  sendMessageUpdate(chatId: string, message: unknown) {
    this.server.to(`chat_${chatId}`).emit('message_updated', message);
  }

  sendMessageDelete(chatId: string, messageId: string) {
    this.server.to(`chat_${chatId}`).emit('message_deleted', { id: messageId });
  }

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake.headers.authorization;
    const [type, token] = auth?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
