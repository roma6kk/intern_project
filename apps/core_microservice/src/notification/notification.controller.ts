import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get notifications for the current user' })
  findMyNotifications(
    @CurrentUser() user: ICurrentUser,
    @Query() pagination: PaginationDto,
  ) {
    return this.notificationService.findByRecipient(user.userId, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification by ID' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification by ID' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
