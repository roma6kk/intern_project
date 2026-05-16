import redis from '../config/redis';

export class RedisRepository {
  private readonly redis = redis;
  
  private readonly BLACKLIST_PREFIX = 'blacklist:';
  private readonly SESSION_TOKEN_PREFIX = 'session_token:';
  private readonly USER_SESSION_PREFIX = 'user_session:';
  private readonly PASSWORD_RESET_CODE_PREFIX = 'password_reset_code:';
  private readonly PASSWORD_RESET_ATTEMPTS_PREFIX = 'password_reset_attempts:';
  private readonly PASSWORD_RESET_COOLDOWN_PREFIX = 'password_reset_cooldown:';

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

  async storePasswordResetCode(email: string, code: string, expiresIn: number): Promise<void> {
    await this.redis.set(
      `${this.PASSWORD_RESET_CODE_PREFIX}${email}`,
      code,
      'EX',
      expiresIn,
    );
  }

  async getPasswordResetCode(email: string): Promise<string | null> {
    return this.redis.get(`${this.PASSWORD_RESET_CODE_PREFIX}${email}`);
  }

  async deletePasswordResetCode(email: string): Promise<void> {
    await this.redis.del(`${this.PASSWORD_RESET_CODE_PREFIX}${email}`);
    await this.redis.del(`${this.PASSWORD_RESET_ATTEMPTS_PREFIX}${email}`);
  }

  async incrementPasswordResetAttempts(email: string, expiresIn: number): Promise<number> {
    const key = `${this.PASSWORD_RESET_ATTEMPTS_PREFIX}${email}`;
    const attempts = await this.redis.incr(key);

    if (attempts === 1) {
      await this.redis.expire(key, expiresIn);
    }

    return attempts;
  }

  async setPasswordResetCooldown(email: string, expiresIn: number): Promise<void> {
    await this.redis.set(
      `${this.PASSWORD_RESET_COOLDOWN_PREFIX}${email}`,
      '1',
      'EX',
      expiresIn,
    );
  }

  async getPasswordResetCooldown(email: string): Promise<number> {
    return this.redis.ttl(`${this.PASSWORD_RESET_COOLDOWN_PREFIX}${email}`);
  }
}

export const redisRepository = new RedisRepository();