import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ITokenPayload } from './interfaces/ITokenPayload';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ?? 'secret';
    this.refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'refresh_secret';
  }

  generateTokens(payload: ITokenPayload) {
    const accessJti = uuidv4();
    const refreshJti = uuidv4();

    const accessToken = jwt.sign(
      { ...payload, jti: accessJti },
      this.accessSecret,
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { ...payload, jti: refreshJti },
      this.refreshSecret,
      {
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
      accessJti,
      refreshJti,
    };
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret) as jwt.JwtPayload;
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecret) as jwt.JwtPayload;
  }

  decodeToken(token: string) {
    return jwt.decode(token) as jwt.JwtPayload;
  }
}
