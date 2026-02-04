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
import { FilesInterceptor } from '@nestjs/platform-express';
import type { ICurrentUser } from 'src/auth/interfaces/ICurrentUser';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message (with optional files)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5))
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
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
