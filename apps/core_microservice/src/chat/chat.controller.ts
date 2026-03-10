import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { ChatGateway } from './chat.gateway';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Chats')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a private or group chat' })
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.create(user.userId, createChatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user chats' })
  findAll(@CurrentUser() user: ICurrentUser) {
    return this.chatService.findAllByUser(user.userId);
  }

  @Get('online')
  async getOnlineUsers() {
    return await this.chatGateway.getOnlineUsers();
  }

  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.chatService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update chat (add/remove members)' })
  update(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatService.update(id, user.userId, updateChatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat' })
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.chatService.remove(id, user.userId);
  }
}
