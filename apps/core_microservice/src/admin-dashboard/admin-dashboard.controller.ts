import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminStatsService } from './admin-stats.service';
import { AdminSystemService } from './admin-system.service';

@ApiTags('Admin Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminDashboardController {
  constructor(
    private readonly stats: AdminStatsService,
    private readonly system: AdminSystemService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Aggregated product metrics (ADMIN)' })
  getStats() {
    return this.stats.getSnapshot();
  }

  @Get('system/health')
  @ApiOperation({ summary: 'Reachability of core DB and configured services' })
  getSystemHealth() {
    return this.system.checkExternalServices();
  }
}
