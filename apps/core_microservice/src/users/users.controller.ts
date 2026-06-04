import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { AllowWhenDeleted } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @AllowWhenDeleted()
  @ApiOperation({ summary: 'Get current user details (Account + Profile)' })
  @ApiResponse({ status: 200, description: 'Returns full user info' })
  async getCurrentUser(@CurrentUser() user: ICurrentUser) {
    return this.usersService.getCurrentUser(user.userId);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Soft delete current user profile' })
  @ApiResponse({ status: 200, description: 'Profile scheduled for deletion' })
  async softDeleteProfile(@CurrentUser() user: ICurrentUser) {
    await this.usersService.softDeleteProfile(user.userId);
    return {
      message:
        'Account scheduled for deletion. You can recover within 30 days.',
    };
  }

  @Post('me/recover')
  @AllowWhenDeleted()
  @ApiOperation({ summary: 'Recover soft-deleted profile within 30 days' })
  @ApiResponse({ status: 200, description: 'Profile recovered' })
  async recoverProfile(@CurrentUser() user: ICurrentUser) {
    await this.usersService.recoverProfile(user.userId);
    return { message: 'Account recovered successfully' };
  }
}
