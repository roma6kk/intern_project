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
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message (with optional files)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  create(
    @CurrentUser() user: ICurrentUser,
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.messageService.create(user.userId, createMessageDto, files);
  }

  @Get(':chatId')
  findAll(@Param('chatId') chatId: string) {
    return this.messageService.findAllByChat(chatId);
  }

  @Get(':senderId')
  findAllBySender(@Param('senderId') senderId: string) {
    return this.messageService.findOne(senderId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit own message (text and/or assets)' })
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FilesInterceptor('files', 10))
  update(
    @CurrentUser() user: ICurrentUser,
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.messageService.update(id, user.userId, updateMessageDto, files);
  }

  @Delete(':id')
  remove(@CurrentUser() user: ICurrentUser, @Param('id') id: string) {
    return this.messageService.remove(id, user.userId);
  }

  @Patch('chat/:chatId/read')
  @ApiOperation({ summary: 'Mark all messages in a chat as read' })
  markChatAsRead(
    @CurrentUser() user: ICurrentUser,
    @Param('chatId') chatId: string,
  ) {
    return this.messageService.markChatAsRead(chatId, user.userId);
  }
}
