import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminStatsService } from './admin-stats.service';
import { AdminSystemService } from './admin-system.service';
import { HealthModule } from '../health/health.module';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [HttpModule, HealthModule, UsersModule],
  controllers: [AdminDashboardController],
  providers: [AdminStatsService, AdminSystemService, RolesGuard],
})
export class AdminDashboardModule {}
