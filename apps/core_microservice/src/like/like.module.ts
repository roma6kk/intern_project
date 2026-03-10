import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NotificationModule, UsersModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
