import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly frontendPublicUrl =
    process.env.FRONTEND_PUBLIC_URL ?? 'https://localhost';

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign In & Token Generation' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.handleLogin(credentials);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Access Token using Cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenId = req.cookies['refreshToken'] as string | undefined;

    if (!refreshTokenId) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const result = await this.authService.handleRefresh(refreshTokenId);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return result;
  }

  @Get('login/:provider')
  @ApiOperation({ summary: 'Initiate OAuth 2.0 login' })
  @ApiParam({ name: 'provider', example: 'google' })
  handleOAuthLogin() {
    return this.authService.handleOAuthInit();
  }

  @Get(':provider/callback')
  @ApiOperation({ summary: 'Handle OAuth 2.0 callback' })
  @ApiQuery({ name: 'code', required: true })
  async handleOAuthCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleOAuthCallback(provider, code);

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.redirect(
      `${this.frontendPublicUrl}/auth/callback?accessToken=${result.accessToken}`,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenId = req.cookies['refreshToken'] as string | undefined;

    if (refreshTokenId) {
      await this.authService.handleLogout(refreshTokenId);
    }

    res.clearCookie('refreshToken', { path: '/', sameSite: 'lax' });
    return { message: 'Logged out successfully' };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.handleSignUp(signUpDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.handleForgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password by email code' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.handleResetPassword(resetPasswordDto);
  }
}
