import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 604800000,
};

@ApiTags('Auth')
@Controller('internal/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private mapAuthError(message: string): number {
    if (message === 'Email not found') return 404;
    if (message === 'Invalid reset code' || message === 'Reset code expired')
      return 401;
    if (message === 'Too many attempts' || message.startsWith('Try again in'))
      return 429;
    return 400;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    try {
      const { email, password } = body;
      const result = await this.authService.authenticateUser({
        email,
        pass: password,
      });

      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      return result;
    } catch (error) {
      res.status(401);
      return { message: (error as Error).message };
    }
  }

  @Post('register')
  async register(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.registerUser(
        body as Parameters<AuthService['registerUser']>[0],
      );
      res.status(201);
      return result;
    } catch (error) {
      res.status(400);
      return { message: (error as Error).message };
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const refreshToken =
        req.body.refresh_token_id ||
        req.body.refreshToken ||
        req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(400);
        return { message: 'Refresh token required' };
      }

      const result = await this.authService.processRefreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      return result;
    } catch {
      res.status(403);
      return { message: 'Refresh failed' };
    }
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() body: { access_token?: string }, @Res({ passthrough: true }) res: Response) {
    try {
      const accessToken = body.access_token;

      if (!accessToken) {
        res.status(400);
        return { message: 'Access token required' };
      }

      return await this.authService.validateToken(accessToken);
    } catch {
      res.status(401);
      return { valid: false };
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const refreshToken =
        req.body.refresh_token_id ||
        req.body.refreshToken ||
        req.cookies?.refreshToken;
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      return { message: 'Logged out' };
    } catch {
      res.status(200);
      return { message: 'Logged out' };
    }
  }

  @Get('oauth/initiate')
  async initiateOAuth(@Res({ passthrough: true }) res: Response) {
    try {
      const url = this.authService.getGoogleOAuthURL();
      return { url };
    } catch (error) {
      res.status(500);
      return { message: (error as Error).message };
    }
  }

  @Post('oauth/exchange-code')
  @HttpCode(HttpStatus.OK)
  async exchangeCode(
    @Body() body: { code?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { code } = body;
      if (!code) {
        res.status(400);
        return { message: 'Code required' };
      }

      const result = await this.authService.exchangeCodeForTokens(code);

      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);
      return result;
    } catch (error) {
      const err = error as {
        response?: { data?: unknown };
        message?: string;
      };
      console.error('OAuth Exchange Error:', err.response?.data || err.message);
      res.status(400);
      return { message: 'OAuth failed' };
    }
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).json({ message: 'Code required' });
    }

    try {
      const result = await this.authService.exchangeCodeForTokens(code);
      const redirectUrl = `${process.env.FRONTEND_PUBLIC_URL}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
      return res.redirect(redirectUrl);
    } catch {
      return res.redirect(
        `${process.env.FRONTEND_PUBLIC_URL}/login?error=oauth_failed`,
      );
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: { email?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { email } = body;
      if (!email) {
        res.status(400);
        return { message: 'Email required' };
      }

      return await this.authService.forgotPassword(email);
    } catch (error) {
      const message = (error as Error).message;
      res.status(this.mapAuthError(message));
      return { message };
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body()
    body: {
      email?: string;
      code?: string;
      newPassword?: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { email, code, newPassword } = body;
      if (!email || !code || !newPassword) {
        res.status(400);
        return { message: 'Email, code and newPassword are required' };
      }
      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        res.status(400);
        return { message: 'Password must be at least 8 characters' };
      }
      if (!/^\d{6}$/.test(String(code))) {
        res.status(400);
        return { message: 'Reset code must contain 6 digits' };
      }

      return await this.authService.resetPassword({
        email,
        code: String(code),
        newPassword,
      });
    } catch (error) {
      const message = (error as Error).message;
      res.status(this.mapAuthError(message));
      return { message };
    }
  }
}
