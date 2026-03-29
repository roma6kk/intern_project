import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountState,
  ModerationLogAction,
  NotificationType,
  SanctionType,
  WarningSource,
  type Prisma,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { ListAdminUsersDto } from './dto/list-admin-users.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { CreateWarningDto } from './dto/create-warning.dto';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { UnsuspendUserDto } from './dto/unsuspend-user.dto';
import { SanctionsPolicyService } from './sanctions-policy.service';
import {
  BulkAdminAction,
  BulkAdminUsersDto,
} from './dto/bulk-admin-users.dto';

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: SanctionsPolicyService,
    private readonly notificationService: NotificationService,
  ) {}

  async listUsers(query: ListAdminUsersDto) {
    const skip = (query.page - 1) * query.limit;
    const where: Prisma.AccountWhereInput = {};

    if (query.role) where.role = query.role;
    if (query.state) where.state = query.state;
    if (query.search?.trim()) {
      where.OR = [
        { username: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.account.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              createdAt: true,
              profile: { select: { firstName: true, secondName: true } },
            },
          },
        },
      }),
      this.prisma.account.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page: query.page, limit: query.limit },
    };
  }

  async updateRole(
    targetUserId: string,
    adminUserId: string,
    dto: UpdateUserRoleDto,
  ) {
    const account = await this.prisma.account.findUnique({
      where: { userId: targetUserId },
    });
    if (!account) throw new NotFoundException('Account not found');

    const updated = await this.prisma.account.update({
      where: { userId: targetUserId },
      data: {
        role: dto.role,
        stateChangedBy: adminUserId,
        stateChangedAt: new Date(),
        stateReason: dto.reason ?? 'ROLE_CHANGED',
      },
    });

    await this.createLog(
      adminUserId,
      targetUserId,
      ModerationLogAction.ROLE_CHANGED,
      dto.reason,
      {
        previousRole: account.role,
        newRole: dto.role,
      },
    );

    return updated;
  }

  async createWarning(
    targetUserId: string,
    adminUserId: string,
    dto: CreateWarningDto,
    reportId?: string,
  ) {
    await this.ensureUserExists(targetUserId);

    const warning = await this.prisma.userWarning.create({
      data: {
        userId: targetUserId,
        actorId: adminUserId,
        reason: dto.reason,
        reportId,
        source: reportId ? WarningSource.REPORT : WarningSource.MANUAL,
      },
    });

    await this.createLog(
      adminUserId,
      targetUserId,
      ModerationLogAction.WARNING_ISSUED,
      dto.reason,
      { reportId: reportId ?? null, warningId: warning.id },
    );

    await this.applyEscalationIfNeeded(targetUserId, adminUserId, reportId);

    let postIdForNotification: string | undefined;
    if (reportId) {
      const r = await this.prisma.report.findUnique({
        where: { id: reportId },
        select: {
          postId: true,
          comment: { select: { postId: true } },
        },
      });
      postIdForNotification =
        r?.postId ?? r?.comment?.postId ?? undefined;
    }

    const text = `Moderation warning: ${dto.reason}`;
    await this.notificationService.create({
      type: NotificationType.SYSTEM,
      recipientId: targetUserId,
      actorId: adminUserId,
      itemId: warning.id,
      postId: postIdForNotification,
      message: text,
    });

    return warning;
  }

  async suspendUser(
    targetUserId: string,
    adminUserId: string,
    dto: SuspendUserDto,
    reportId?: string,
  ) {
    if (dto.until <= new Date()) {
      throw new BadRequestException('Suspension end must be in the future');
    }
    await this.ensureUserExists(targetUserId);

    const sanction = await this.prisma.userSanction.create({
      data: {
        userId: targetUserId,
        actorId: adminUserId,
        reportId,
        type: SanctionType.SUSPEND,
        reason: dto.reason,
        until: dto.until,
        isActive: true,
      },
    });

    await this.prisma.account.update({
      where: { userId: targetUserId },
      data: {
        state: AccountState.SUSPENDED,
        suspendedUntil: dto.until,
        stateChangedAt: new Date(),
        stateChangedBy: adminUserId,
        stateReason: dto.reason,
      },
    });

    await this.createLog(
      adminUserId,
      targetUserId,
      ModerationLogAction.SUSPENDED,
      dto.reason,
      {
        until: dto.until.toISOString(),
        sanctionId: sanction.id,
        reportId: reportId ?? null,
      },
    );

    return sanction;
  }

  async unsuspendUser(
    targetUserId: string,
    adminUserId: string,
    dto: UnsuspendUserDto,
  ) {
    await this.ensureUserExists(targetUserId);

    await this.prisma.userSanction.updateMany({
      where: {
        userId: targetUserId,
        type: SanctionType.SUSPEND,
        isActive: true,
      },
      data: { isActive: false, revokedAt: new Date() },
    });

    const account = await this.prisma.account.update({
      where: { userId: targetUserId },
      data: {
        state: AccountState.ACTIVE,
        suspendedUntil: null,
        stateChangedAt: new Date(),
        stateChangedBy: adminUserId,
        stateReason: dto.reason ?? 'UNSUSPENDED_BY_ADMIN',
      },
    });

    await this.createLog(
      adminUserId,
      targetUserId,
      ModerationLogAction.UNSUSPENDED,
      dto.reason,
    );
    return account;
  }

  async getHistory(targetUserId: string) {
    await this.ensureUserExists(targetUserId);

    const [warnings, sanctions, logs] = await Promise.all([
      this.prisma.userWarning.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              account: { select: { username: true } },
            },
          },
        },
      }),
      this.prisma.userSanction.findMany({
        where: { userId: targetUserId },
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              account: { select: { username: true } },
            },
          },
        },
      }),
      this.prisma.moderationLog.findMany({
        where: { targetUserId },
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              account: { select: { username: true } },
            },
          },
        },
      }),
    ]);

    const timeline = [
      ...warnings.map((w) => ({
        kind: 'WARNING' as const,
        id: w.id,
        createdAt: w.createdAt,
        reason: w.reason,
        actorUsername: w.actor.account?.username ?? w.actorId,
      })),
      ...sanctions.map((s) => ({
        kind: 'SANCTION' as const,
        id: s.id,
        createdAt: s.createdAt,
        reason: s.reason,
        until: s.until,
        isActive: s.isActive,
        actorUsername: s.actor.account?.username ?? s.actorId,
      })),
      ...logs.map((l) => ({
        kind: 'LOG' as const,
        id: l.id,
        createdAt: l.createdAt,
        actionType: l.actionType,
        reason: l.reason,
        metadata: l.metadata,
        actorUsername: l.actor.account?.username ?? l.actorId,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { warnings, sanctions, logs, timeline };
  }

  async bulkApply(adminUserId: string, dto: BulkAdminUsersDto) {
    const uniqueIds = [...new Set(dto.userIds)];
    if (uniqueIds.length > 50) {
      throw new BadRequestException('At most 50 user ids per request');
    }

    switch (dto.action) {
      case BulkAdminAction.WARN:
        if (!dto.warn?.reason) {
          throw new BadRequestException('warn.reason is required');
        }
        break;
      case BulkAdminAction.SUSPEND:
        if (!dto.suspend?.until || !dto.suspend?.reason) {
          throw new BadRequestException('suspend.until and suspend.reason are required');
        }
        break;
      case BulkAdminAction.UNSUSPEND:
        break;
      case BulkAdminAction.ROLE:
        if (!dto.rolePayload?.role) {
          throw new BadRequestException('rolePayload.role is required');
        }
        break;
      default:
        throw new BadRequestException('Invalid action');
    }

    const succeeded: string[] = [];
    const failed: { userId: string; error: string }[] = [];

    for (const targetUserId of uniqueIds) {
      try {
        switch (dto.action) {
          case BulkAdminAction.WARN:
            await this.createWarning(
              targetUserId,
              adminUserId,
              { reason: dto.warn!.reason },
            );
            break;
          case BulkAdminAction.SUSPEND:
            await this.suspendUser(targetUserId, adminUserId, {
              until: dto.suspend!.until,
              reason: dto.suspend!.reason,
            });
            break;
          case BulkAdminAction.UNSUSPEND:
            await this.unsuspendUser(targetUserId, adminUserId, {
              reason: dto.unsuspend?.reason,
            });
            break;
          case BulkAdminAction.ROLE:
            await this.updateRole(targetUserId, adminUserId, {
              role: dto.rolePayload!.role,
              reason: dto.rolePayload?.reason,
            });
            break;
        }
        succeeded.push(targetUserId);
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === 'object' && e && 'message' in e
              ? String((e as { message: unknown }).message)
              : 'Unknown error';
        failed.push({ userId: targetUserId, error: msg });
      }
    }

    return { succeeded, failed, total: uniqueIds.length };
  }

  private async applyEscalationIfNeeded(
    targetUserId: string,
    adminUserId: string,
    reportId?: string,
  ) {
    const from = new Date();
    from.setDate(from.getDate() - this.policy.warningWindowDays);
    const count = await this.prisma.userWarning.count({
      where: { userId: targetUserId, createdAt: { gte: from } },
    });

    if (count < this.policy.warningThreshold) return;

    const until = new Date();
    until.setDate(until.getDate() + this.policy.defaultSuspendDays);

    const account = await this.prisma.account.findUnique({
      where: { userId: targetUserId },
    });
    const nextLevel = (account?.escalationLevel ?? 0) + 1;

    await this.suspendUser(
      targetUserId,
      adminUserId,
      { reason: `AUTO_ESCALATION_${count}_WARNINGS`, until },
      reportId,
    );

    await this.prisma.account.update({
      where: { userId: targetUserId },
      data: { escalationLevel: nextLevel },
    });

    await this.createLog(
      adminUserId,
      targetUserId,
      ModerationLogAction.ESCALATED,
      `Escalated after ${count} warnings`,
      { count, nextLevel, until: until.toISOString() },
    );
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
  }

  private async createLog(
    actorId: string,
    targetUserId: string,
    actionType: ModerationLogAction,
    reason?: string,
    metadata?: Prisma.JsonObject,
  ) {
    await this.prisma.moderationLog.create({
      data: {
        actorId,
        targetUserId,
        actionType,
        reason,
        metadata,
      },
    });
  }
}
