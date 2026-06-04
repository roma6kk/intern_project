import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class TokenBlacklistService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TokenBlacklistService.name);
  private readonly prefix = 'blacklist:';
  private client: RedisClientType | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const redisUrl =
      this.configService.get<string>('REDIS_URL') ?? 'redis://127.0.0.1:6379';
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (err) =>
      this.logger.error('Redis blacklist client error', err),
    );
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }
    const value = await this.client.get(`${this.prefix}${jti}`);
    return value === 'true';
  }
}
