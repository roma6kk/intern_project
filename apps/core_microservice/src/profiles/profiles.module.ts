import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
