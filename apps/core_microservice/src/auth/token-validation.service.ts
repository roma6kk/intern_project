import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { ICurrentUser } from './interfaces/ICurrentUser';
import { TokenBlacklistService } from './token-blacklist.service';

type AccessTokenPayload = jwt.JwtPayload & {
  userId: string;
  username: string;
  email?: string | null;
  role: ICurrentUser['role'];
  accountState: ICurrentUser['accountState'];
  suspendedUntil?: string | null;
  escalationLevel?: number;
  jti?: string;
};

@Injectable()
export class TokenValidationService {
  private readonly accessSecret: string | null;
  private readonly cache = new Map<
    string,
    { user: ICurrentUser; expiresAt: number }
  >();
  private readonly cacheTtlMs = 30_000;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenBlacklist: TokenBlacklistService,
  ) {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET')?.trim();
    this.accessSecret = secret || null;
  }

  canValidateLocally(): boolean {
    return Boolean(this.accessSecret);
  }

  async validateAccessToken(accessToken: string): Promise<ICurrentUser> {
    if (!this.accessSecret) {
      throw new UnauthorizedException('Local JWT validation is not configured');
    }

    let payload: AccessTokenPayload;
    try {
      payload = jwt.verify(
        accessToken,
        this.accessSecret,
      ) as AccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    if (!payload.userId || !payload.username || !payload.role) {
      throw new UnauthorizedException('Token payload is invalid');
    }

    if (payload.jti) {
      const cached = this.cache.get(payload.jti);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.user;
      }

      if (await this.tokenBlacklist.isBlacklisted(payload.jti)) {
        throw new UnauthorizedException('Token is blacklisted');
      }
    }

    const user: ICurrentUser = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      accountState: payload.accountState,
      suspendedUntil: payload.suspendedUntil ?? null,
      escalationLevel: payload.escalationLevel,
    };

    if (payload.jti) {
      this.cache.set(payload.jti, {
        user,
        expiresAt: Date.now() + this.cacheTtlMs,
      });
    }

    return user;
  }
}
