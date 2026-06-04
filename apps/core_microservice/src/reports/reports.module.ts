import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { NotificationModule } from '../notification/notification.module';
import { ReportsSlaCronService } from './reports-sla.cron';

@Module({
  imports: [UsersModule, AdminUsersModule, NotificationModule],
  controllers: [ReportsController],
  providers: [ReportsService, RolesGuard, ReportsSlaCronService],
})
export class ReportsModule {}
