import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from '../chat/chat.module';
import { FilesModule } from '../files/file.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ChatModule, FilesModule, UsersModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
