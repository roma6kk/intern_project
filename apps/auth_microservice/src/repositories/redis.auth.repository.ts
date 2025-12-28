import redis from '../config/redis';

export class RedisRepository {
  private readonly redis = redis;
  
  private readonly BLACKLIST_PREFIX = 'blacklist:';
  private readonly SESSION_TOKEN_PREFIX = 'session_token:';
  private readonly USER_SESSION_PREFIX = 'user_session:';

  async isTokenBlacklisted(tokenId: string): Promise<boolean> {
    const result = await this.redis.get(`${this.BLACKLIST_PREFIX}${tokenId}`);
    return result === 'true';
  }

  async blacklistToken(tokenId: string, expiresIn: number): Promise<void> {
    await this.redis.set(
      `${this.BLACKLIST_PREFIX}${tokenId}`,
      'true',
      'EX',
      expiresIn
    );
  }

  async storeRefreshTokenId(userId: string, refreshTokenId: string, expiresIn: number): Promise<void> {
    const oldTokenId = await this.redis.get(`${this.USER_SESSION_PREFIX}${userId}`);
    
    if (oldTokenId) {
      await this.redis.del(`${this.SESSION_TOKEN_PREFIX}${oldTokenId}`);
    }

    await this.redis.set(
      `${this.USER_SESSION_PREFIX}${userId}`,
      refreshTokenId,
      'EX',
      expiresIn
    );

    await this.redis.set(
      `${this.SESSION_TOKEN_PREFIX}${refreshTokenId}`,
      userId,
      'EX',
      expiresIn
    );
  }

  async findSessionByTokenId(tokenId: string): Promise<string | null> {
    return this.redis.get(`${this.SESSION_TOKEN_PREFIX}${tokenId}`);
  }

  async deleteSession(userId: string): Promise<void> {
    const tokenId = await this.redis.get(`${this.USER_SESSION_PREFIX}${userId}`);
    if (tokenId) {
      await this.redis.del(`${this.SESSION_TOKEN_PREFIX}${tokenId}`);
    }
    await this.redis.del(`${this.USER_SESSION_PREFIX}${userId}`);
  }
}

export const redisRepository = new RedisRepository();