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
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
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

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Access Token using Cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenId = req.cookies['refreshToken'];

    if (!refreshTokenId) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const result = await this.authService.handleRefresh(refreshTokenId);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Get('login/:provider')
  @ApiOperation({ summary: 'Initiate OAuth 2.0 login' })
  @ApiParam({ name: 'provider', example: 'google' })
  async handleOAuthLogin(@Param('provider') provider: string) {
    return this.authService.handleOAuthInit(provider);
  }

  @Get(':provider/callback')
  @ApiOperation({ summary: 'Handle OAuth 2.0 callback' })
  @ApiQuery({ name: 'code', required: true })
  async handleOAuthCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.handleOAuthCallback(provider, code);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenId = req.cookies['refreshToken'];

    if (refreshTokenId) {
      await this.authService.handleLogout(refreshTokenId);
    }

    res.clearCookie('refreshToken');
    return { message: 'Logged out successfully' };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.handleSignUp(signUpDto);
  }
}
