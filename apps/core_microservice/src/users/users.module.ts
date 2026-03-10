import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../database/prisma.module';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, DeletedUserGuard],
  exports: [UsersService, DeletedUserGuard],
})
export class UsersModule {}
