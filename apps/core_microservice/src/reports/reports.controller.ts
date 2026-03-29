import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { UpdateReportPriorityDto } from './dto/update-report-priority.dto';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles('USER', 'MODERATOR', 'ADMIN')
  create(@CurrentUser() user: ICurrentUser, @Body() dto: CreateReportDto) {
    return this.reportsService.create(user.userId, dto);
  }

  @Get()
  @Roles('MODERATOR', 'ADMIN')
  findAll(@Query() query: ListReportsQueryDto) {
    return this.reportsService.findAll(query);
  }

  @Patch(':id/assign')
  @Roles('MODERATOR', 'ADMIN')
  assign(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
    @Body() dto: AssignReportDto,
  ) {
    return this.reportsService.assign(id, user.userId, dto);
  }

  @Patch(':id/priority')
  @Roles('MODERATOR', 'ADMIN')
  setPriority(@Param('id') id: string, @Body() dto: UpdateReportPriorityDto) {
    return this.reportsService.updatePriority(id, dto);
  }

  @Patch(':id')
  @Roles('MODERATOR', 'ADMIN')
  update(
    @Param('id') id: string,
    @CurrentUser() user: ICurrentUser,
    @Body() dto: UpdateReportDto,
  ) {
    return this.reportsService.update(id, user.userId, dto);
  }
}
