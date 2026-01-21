import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { ProfileModule } from './profile/profile.module';
import { FollowModule } from './follow/follow.module';
import { AssetModule } from './asset/asset.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PostModule,
    UserModule,
    AccountModule,
    ProfileModule,
    FollowModule,
    AssetModule,
    CommentModule,
    LikeModule,
    ChatModule,
    MessageModule,
    NotificationModule,
    AuthModule,
    FilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
