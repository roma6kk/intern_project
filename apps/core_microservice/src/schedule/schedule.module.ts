import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { PurgeDeletedUsersService } from './purge-deleted-users.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [NestScheduleModule.forRoot(), PrismaModule],
  providers: [PurgeDeletedUsersService],
})
export class ScheduleModule {}
