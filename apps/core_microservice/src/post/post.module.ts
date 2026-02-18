import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../database/prisma.module';
import { FilesModule } from '../files/file.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, FilesModule, NotificationModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
