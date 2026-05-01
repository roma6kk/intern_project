import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { FilesModule } from '../files/file.module';
import { UsersModule } from '../users/users.module';
import { ChatModule } from '../chat/chat.module';
import { MessageModule } from '../message/message.module';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  imports: [PrismaModule, FilesModule, UsersModule, ChatModule, MessageModule],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}

