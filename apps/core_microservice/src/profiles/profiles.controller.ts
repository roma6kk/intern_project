import { Body, Controller, Get, Put, UseGuards, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return profile data' })
  async getMyProfile(@CurrentUser() user: ICurrentUser) {
    return this.profilesService.getMyProfile(user.userId);
  }

  @Get('by-username/:username')
  @ApiOperation({ summary: 'Get user profile by username' })
  @ApiResponse({ status: 200, description: 'Return profile data' })
  async getUserProfileByUsername(@Param('username') username: string) {
    return this.profilesService.getProfileByUsername(username);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Return profile data' })
  async getUserProfile(@Param('userId') userId: string) {
    return this.profilesService.getMyProfile(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: ICurrentUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.userId, updateProfileDto);
  }
}
