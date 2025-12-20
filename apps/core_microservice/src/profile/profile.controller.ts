import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findByUser(@Param('userId') userId: string) {
    return this.profileService.findByUser(userId);
  }

  @Patch(':id')
  updateByUser(
    @Param('useeId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateByUser(userId, updateProfileDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.profileService.removeByUser(userId);
  }
}
