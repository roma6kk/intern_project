import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { ProfilesModule } from './profiles/profiles.module';
import { FollowModule } from './follow/follow.module';
import { AssetModule } from './asset/asset.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from './schedule/schedule.module';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ReportsModule } from './reports/reports.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AssistantModule } from './assistant/assistant.module';
@Module({
  imports: [
    ScheduleModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    PostModule,
    UsersModule,
    AccountModule,
    ProfilesModule,
    FollowModule,
    AssetModule,
    CommentModule,
    LikeModule,
    ChatModule,
    MessageModule,
    NotificationModule,
    AuthModule,
    FilesModule,
    ReportsModule,
    AdminUsersModule,
    AdminDashboardModule,
    AssistantModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.getOrThrow<string>('REDIS_URL');
        return {
          stores: [new KeyvRedis(redisUrl)],
          ttl: 600_000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
