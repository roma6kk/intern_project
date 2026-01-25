import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/chat/chat.module';
import { FilesModule } from 'src/files/file.module';

@Module({
  imports: [ChatModule, FilesModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
