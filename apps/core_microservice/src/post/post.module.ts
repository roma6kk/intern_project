import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../database/prisma.module';
import { FilesModule } from '../files/file.module';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
