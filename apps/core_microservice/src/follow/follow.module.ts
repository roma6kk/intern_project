import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NotificationModule, UsersModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
