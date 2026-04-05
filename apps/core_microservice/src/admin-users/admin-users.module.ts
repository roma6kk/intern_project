import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { SanctionsPolicyService } from './sanctions-policy.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UsersModule, NotificationModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, RolesGuard, SanctionsPolicyService],
  exports: [AdminUsersService, SanctionsPolicyService],
})
export class AdminUsersModule {}
