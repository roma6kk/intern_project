import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NotificationModule, UsersModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
