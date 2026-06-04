import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a private or group chat' })
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createChatDto: CreateChatDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.chatService.create(user.userId, createChatDto, file);
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update chat (add/remove members)' })
  update(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.chatService.update(id, user.userId, updateChatDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chat' })
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.chatService.remove(id, user.userId);
  }
}
