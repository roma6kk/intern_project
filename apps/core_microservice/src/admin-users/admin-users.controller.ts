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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeletedUserGuard } from '../auth/guards/deleted-user.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { ICurrentUser } from '../auth/interfaces/ICurrentUser';
import { AdminUsersService } from './admin-users.service';
import { ListAdminUsersDto } from './dto/list-admin-users.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateWarningDto } from './dto/create-warning.dto';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { UnsuspendUserDto } from './dto/unsuspend-user.dto';
import { BulkAdminUsersDto } from './dto/bulk-admin-users.dto';

@ApiTags('Admin Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, DeletedUserGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  list(@Query() query: ListAdminUsersDto) {
    return this.adminUsersService.listUsers(query);
  }

  @Post('bulk')
  bulk(@CurrentUser() admin: ICurrentUser, @Body() dto: BulkAdminUsersDto) {
    return this.adminUsersService.bulkApply(admin.userId, dto);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: ICurrentUser,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminUsersService.updateRole(targetUserId, admin.userId, dto);
  }

  @Post(':id/warnings')
  createWarning(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: ICurrentUser,
    @Body() dto: CreateWarningDto,
  ) {
    return this.adminUsersService.createWarning(
      targetUserId,
      admin.userId,
      dto,
    );
  }

  @Post(':id/suspend')
  suspend(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: ICurrentUser,
    @Body() dto: SuspendUserDto,
  ) {
    return this.adminUsersService.suspendUser(targetUserId, admin.userId, dto);
  }

  @Post(':id/unsuspend')
  unsuspend(
    @Param('id') targetUserId: string,
    @CurrentUser() admin: ICurrentUser,
    @Body() dto: UnsuspendUserDto,
  ) {
    return this.adminUsersService.unsuspendUser(
      targetUserId,
      admin.userId,
      dto,
    );
  }

  @Get(':id/history')
  getHistory(@Param('id') targetUserId: string) {
    return this.adminUsersService.getHistory(targetUserId);
  }
}
