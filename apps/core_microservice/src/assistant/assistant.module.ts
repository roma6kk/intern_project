import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { PrismaModule } from '../database/prisma.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,
    ChatModule,
    UsersModule,
    HttpModule.register({
      timeout: 26_000,
      maxRedirects: 0,
    }),
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
