import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { PrismaService } from '../database/prisma.service';
import { RedisAuthRepository } from '../repositories/redis-auth.repository';
import { PasswordResetEventService } from './password-reset-event.service';
import { TokenService } from './token.service';
import { IGoogleUserResult } from './interfaces/IGoogleUserResult';
import { IRegisterUserDto } from './interfaces/IRegisterUserDto';

@Injectable()
export class AuthService {
  private readonly resetCodeTTLSeconds = 10 * 60;
  private readonly resetCodeCooldownSeconds = 60;
  private readonly maxResetAttempts = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisRepository: RedisAuthRepository,
    private readonly passwordResetEventService: PasswordResetEventService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  private async generateNewTokens(params: {
    userId: string;
    username: string;
    email?: string | null;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    accountState: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
    suspendedUntil?: string | null;
    escalationLevel?: number;
    deletedAt?: string | null;
  }) {
    const tokens = this.tokenService.generateTokens(params);

    await this.redisRepository.storeRefreshTokenId(
      params.userId,
      tokens.refreshJti,
      604800,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: params.userId,
        username: params.username,
        role: params.role,
        accountState: params.accountState,
        suspendedUntil: params.suspendedUntil,
        escalationLevel: params.escalationLevel,
        deletedAt: params.deletedAt,
      },
    };
  }

  async registerUser(signUpDto: IRegisterUserDto) {
    const existing = await this.prisma.account.findFirst({
      where: {
        OR: [{ email: signUpDto.email }, { username: signUpDto.username }],
      },
    });
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          account: {
            create: {
              email: signUpDto.email,
              username: signUpDto.username,
              phoneNumber: signUpDto.phoneNumber,
              passwordHash: hashedPassword,
            },
          },
          profile: {
            create: {
              firstName: signUpDto.firstName,
              secondName: signUpDto.secondName,
            },
          },
        },
        include: { account: true },
      });

      if (!user.account) throw new Error('Account creation failed');
      return this.generateNewTokens({
        userId: user.id,
        username: user.account.username,
        email: user.account.email,
        role: user.account.role,
        accountState: user.account.state,
        suspendedUntil: user.account.suspendedUntil?.toISOString() ?? null,
        escalationLevel: user.account.escalationLevel,
        deletedAt: user.deletedAt?.toISOString() ?? null,
      });
    } catch (e) {
      console.error(e);
      throw new Error('Registration failed');
    }
  }

  async authenticateUser(credentials: { email: string; pass: string }) {
    const account = await this.prisma.account.findUnique({
      where: { email: credentials.email },
      include: { user: true },
    });

    if (!account || !account.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(
      credentials.pass,
      account.passwordHash,
    );
    if (!isValid) throw new Error('Invalid credentials');

    return this.generateNewTokens({
      userId: account.userId,
      username: account.username,
      email: account.email,
      role: account.role,
      accountState: account.state,
      suspendedUntil: account.suspendedUntil?.toISOString() ?? null,
      escalationLevel: account.escalationLevel,
      deletedAt: account.user?.deletedAt?.toISOString() ?? null,
    });
  }

  async processRefreshToken(oldRefreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(oldRefreshToken);
    const tokenId = payload.jti;

    if (!tokenId) throw new Error('Invalid token structure');

    const storedUserId =
      await this.redisRepository.findSessionByTokenId(tokenId);

    if (!storedUserId || storedUserId !== payload.userId) {
      throw new Error('Invalid or expired refresh token');
    }

    const account = await this.prisma.account.findUnique({
      where: { userId: payload.userId },
      include: { user: true },
    });
    if (!account) {
      throw new Error('Account not found');
    }
    return this.generateNewTokens({
      userId: payload.userId,
      username: account.username,
      email: account.email,
      role: account.role,
      accountState: account.state,
      suspendedUntil: account.suspendedUntil?.toISOString() ?? null,
      escalationLevel: account.escalationLevel,
      deletedAt: account.user?.deletedAt?.toISOString() ?? null,
    });
  }

  async validateToken(accessToken: string) {
    const payload = this.tokenService.verifyAccessToken(accessToken);

    if (payload.jti) {
      const isBlacklisted = await this.redisRepository.isTokenBlacklisted(
        payload.jti,
      );
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }
    }

    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      accountState: payload.accountState,
      suspendedUntil: payload.suspendedUntil,
      escalationLevel: payload.escalationLevel,
    };
  }

  async handleOAuthLogin(profile: {
    email: string;
    username: string;
    photo?: string;
    firstName?: string;
    secondName?: string;
  }) {
    let account = await this.prisma.account.findUnique({
      where: { email: profile.email },
      include: { user: true },
    });

    if (!account) {
      let finalUsername = profile.username;
      let counter = 1;
      while (
        await this.prisma.account.findUnique({
          where: { username: finalUsername },
        })
      ) {
        finalUsername = `${profile.username}${counter}`;
        counter++;
      }

      const newUser = await this.prisma.user.create({
        data: {
          account: {
            create: {
              email: profile.email,
              username: finalUsername,
              passwordHash: null,
            },
          },
          profile: {
            create: {
              firstName: profile.firstName || 'User',
              secondName: profile.secondName,
              avatarUrl: profile.photo,
            },
          },
        },
        include: { account: { include: { user: true } } },
      });

      if (!newUser.account) throw new Error('Account creation failed');
      account = newUser.account;
    }

    return this.generateNewTokens({
      userId: account.userId,
      username: account.username,
      email: account.email,
      role: account.role,
      accountState: account.state,
      suspendedUntil: account.suspendedUntil?.toISOString() ?? null,
      escalationLevel: account.escalationLevel,
      deletedAt: account.user?.deletedAt?.toISOString() ?? null,
    });
  }

  async logout(refreshToken: string) {
    const payload = this.tokenService.decodeToken(refreshToken);
    if (payload && payload.userId) {
      await this.redisRepository.deleteSession(payload.userId);
    }
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const account = await this.prisma.account.findUnique({
      where: { email: normalizedEmail },
    });

    if (!account) {
      throw new Error('Email not found');
    }

    const cooldownTTL =
      await this.redisRepository.getPasswordResetCooldown(normalizedEmail);
    if (cooldownTTL > 0) {
      throw new Error(`Try again in ${cooldownTTL} seconds`);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redisRepository.storePasswordResetCode(
      normalizedEmail,
      code,
      this.resetCodeTTLSeconds,
    );
    await this.redisRepository.setPasswordResetCooldown(
      normalizedEmail,
      this.resetCodeCooldownSeconds,
    );
    await this.passwordResetEventService.publishPasswordResetEmail({
      email: normalizedEmail,
      code,
      username: account.username,
    });

    return { message: 'Reset code sent' };
  }

  async resetPassword(params: {
    email: string;
    code: string;
    newPassword: string;
  }) {
    const normalizedEmail = params.email.trim().toLowerCase();
    const account = await this.prisma.account.findUnique({
      where: { email: normalizedEmail },
    });

    if (!account) {
      throw new Error('Email not found');
    }

    const savedCode =
      await this.redisRepository.getPasswordResetCode(normalizedEmail);
    if (!savedCode) {
      throw new Error('Reset code expired');
    }

    const attempts = await this.redisRepository.incrementPasswordResetAttempts(
      normalizedEmail,
      this.resetCodeTTLSeconds,
    );
    if (attempts > this.maxResetAttempts) {
      await this.redisRepository.deletePasswordResetCode(normalizedEmail);
      throw new Error('Too many attempts');
    }

    if (savedCode !== params.code) {
      throw new Error('Invalid reset code');
    }

    const newPasswordHash = await bcrypt.hash(params.newPassword, 10);
    await this.prisma.account.update({
      where: { email: normalizedEmail },
      data: { passwordHash: newPasswordHash },
    });

    await this.redisRepository.deletePasswordResetCode(normalizedEmail);
    await this.redisRepository.deleteSession(account.userId);

    return { message: 'Password updated successfully' };
  }

  getGoogleOAuthURL() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: this.configService.get<string>('GOOGLE_CALLBACK_URL')!,
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID')!,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
  }

  async exchangeCodeForTokens(code: string) {
    const { id_token, access_token } = await this.getGoogleTokens(code);
    const googleUser = await this.getGoogleUser(id_token, access_token);

    if (!googleUser.email) {
      throw new Error('Google account has no email');
    }

    return this.handleOAuthLogin({
      email: googleUser.email,
      username: googleUser.email.split('@')[0] ?? 'user',
      firstName: googleUser.given_name ?? 'User',
      secondName: googleUser.family_name ?? '',
      photo: googleUser.picture ?? '',
    });
  }

  private async getGoogleTokens(
    code: string,
  ): Promise<{ access_token: string; id_token: string }> {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID') || '',
      client_secret:
        this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      redirect_uri: this.configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      grant_type: 'authorization_code',
    };

    try {
      const res = await axios.post(
        url,
        new URLSearchParams(values as Record<string, string>).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as { message?: string };
      throw new Error(
        `Google Token Exchange Failed: ${err.message || 'Unknown error'}`,
      );
    }
  }

  private async getGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<IGoogleUserResult> {
    try {
      const res = await axios.get<IGoogleUserResult>(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: { Authorization: `Bearer ${id_token}` },
        },
      );
      return res.data;
    } catch (error) {
      const err = error as { message?: string };
      throw new Error(
        `Google User Info Failed: ${err.message || 'Unknown error'}`,
      );
    }
  }
}
