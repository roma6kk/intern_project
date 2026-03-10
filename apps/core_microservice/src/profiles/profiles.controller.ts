import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  Param,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';

import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return profile data' })
  async getMyProfile(@CurrentUser() user: ICurrentUser) {
    return this.profilesService.getMyProfile(user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search profiles by username or name' })
  async search(@Query('query') query: string) {
    if (!query) return [];
    return this.profilesService.searchProfiles(query);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get suggested users to follow (not following)' })
  async getSuggestions(
    @CurrentUser() user: ICurrentUser,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? Math.min(parseInt(limit, 10) || 10, 10) : 10;
    return this.profilesService.getSuggestions(user.userId, limitNum);
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

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  async uploadAvatar(
    @CurrentUser() user: ICurrentUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.uploadAvatar(user.userId, file);
  }
}
