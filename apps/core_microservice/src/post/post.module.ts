import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../database/prisma.module';
import { FilesModule } from '../files/file.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, FilesModule, NotificationModule, UsersModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
