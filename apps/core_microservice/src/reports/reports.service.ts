import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ModerationAction,
  NotificationType,
  Prisma,
  ReportStatus,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { ListReportsQueryDto } from './dto/list-reports-query.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { UpdateReportPriorityDto } from './dto/update-report-priority.dto';
import { NotificationService } from '../notification/notification.service';

const defaultSlaHours = () =>
  Number(process.env.REPORT_SLA_HOURS) > 0
    ? Number(process.env.REPORT_SLA_HOURS)
    : 72;

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly adminUsersService: AdminUsersService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(reporterId: string, dto: CreateReportDto) {
    if ((!dto.postId && !dto.commentId) || (dto.postId && dto.commentId)) {
      throw new BadRequestException(
        'Provide exactly one target: postId or commentId',
      );
    }

    if (dto.postId) {
      const post = await this.prisma.post.findUnique({
        where: { id: dto.postId },
        select: { id: true },
      });
      if (!post) throw new NotFoundException('Post not found');
    }

    if (dto.commentId) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: dto.commentId },
        select: { id: true },
      });
      if (!comment) throw new NotFoundException('Comment not found');
    }

    const dueAt = new Date();
    dueAt.setHours(dueAt.getHours() + defaultSlaHours());

    return this.prisma.report.create({
      data: {
        reporterId,
        postId: dto.postId,
        commentId: dto.commentId,
        reason: dto.reason,
        dueAt,
      },
    });
  }

  async findAll(query?: ListReportsQueryDto) {
    const where: Prisma.ReportWhereInput = {};

    if (query?.status) where.status = query.status;
    if (query?.priority) where.priority = query.priority;
    if (query?.assignedModeratorId) {
      where.assignedModeratorId = query.assignedModeratorId;
    }
    if (query?.overdue) {
      where.dueAt = { lt: new Date() };
      where.status = { in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW] };
    }

    return this.prisma.report.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        reporter: {
          select: {
            id: true,
            account: { select: { username: true } },
          },
        },
        assignedModerator: {
          select: {
            id: true,
            account: { select: { username: true } },
          },
        },
        post: {
          select: {
            id: true,
            authorId: true,
            isHidden: true,
            description: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                account: { select: { username: true } },
              },
            },
          },
        },
        comment: {
          select: {
            id: true,
            authorId: true,
            postId: true,
            isHidden: true,
            content: true,
            author: {
              select: {
                id: true,
                account: { select: { username: true } },
              },
            },
          },
        },
        resolvedBy: {
          select: {
            id: true,
            account: { select: { username: true } },
          },
        },
      },
    });
  }

  async assign(reportId: string, actorUserId: string, dto: AssignReportDto) {
    const existing = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        comment: { select: { postId: true } },
      },
    });
    if (!existing) throw new NotFoundException('Report not found');

    const assigneeId = dto.assignedModeratorId;
    if (assigneeId) {
      const u = await this.prisma.user.findUnique({
        where: { id: assigneeId },
        select: { id: true },
      });
      if (!u) throw new NotFoundException('Assignee user not found');
    }

    const prevAssignee = existing.assignedModeratorId;

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: { assignedModeratorId: assigneeId },
      include: {
        assignedModerator: {
          select: {
            id: true,
            account: { select: { username: true } },
          },
        },
        comment: { select: { postId: true } },
      },
    });

    if (assigneeId && assigneeId !== prevAssignee) {
      const preview =
        existing.reason.length > 120
          ? `${existing.reason.slice(0, 120)}…`
          : existing.reason;
      await this.notificationService.create({
        type: NotificationType.SYSTEM,
        recipientId: assigneeId,
        actorId: actorUserId,
        itemId: reportId,
        postId: existing.postId ?? existing.comment?.postId ?? undefined,
        message: `You were assigned a moderation report (${existing.priority}). ${preview}`,
      });
    }

    return updated;
  }

  async updatePriority(reportId: string, dto: UpdateReportPriorityDto) {
    const r = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!r) throw new NotFoundException('Report not found');
    return this.prisma.report.update({
      where: { id: reportId },
      data: { priority: dto.priority },
    });
  }

  async update(reportId: string, moderatorId: string, dto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { post: true, comment: true },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const action = dto.action ?? ModerationAction.NONE;
    const effectiveStatus =
      action === ModerationAction.WARN ? ReportStatus.IN_REVIEW : dto.status;

    const resolvedAt =
      effectiveStatus === ReportStatus.RESOLVED ||
      effectiveStatus === ReportStatus.REJECTED
        ? new Date()
        : null;
    const resolvedById =
      effectiveStatus === ReportStatus.RESOLVED ||
      effectiveStatus === ReportStatus.REJECTED
        ? moderatorId
        : null;

    const firstResponseAt =
      !report.firstResponseAt &&
      report.status === ReportStatus.OPEN &&
      (effectiveStatus === ReportStatus.IN_REVIEW ||
        effectiveStatus === ReportStatus.RESOLVED ||
        effectiveStatus === ReportStatus.REJECTED)
        ? new Date()
        : undefined;

    if (action === ModerationAction.HIDE) {
      if (report.postId) {
        await this.prisma.post.update({
          where: { id: report.postId },
          data: { isHidden: true },
        });
      }
      if (report.commentId) {
        await this.prisma.comment.update({
          where: { id: report.commentId },
          data: { isHidden: true },
        });
      }
    }

    if (action === ModerationAction.WARN) {
      const targetUserId = report.comment?.authorId ?? report.post?.authorId;
      if (!targetUserId) {
        throw new BadRequestException('Cannot resolve target user for warning');
      }
      await this.adminUsersService.createWarning(
        targetUserId,
        moderatorId,
        {
          reason:
            dto.warningReason ?? dto.resolutionNote ?? 'Violation warning',
        },
        report.id,
      );
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: effectiveStatus,
        action,
        resolutionNote: dto.resolutionNote,
        resolvedAt,
        resolvedById,
        ...(firstResponseAt ? { firstResponseAt } : {}),
      },
    });

    if (action === ModerationAction.DELETE) {
      if (report.commentId) {
        await this.prisma.comment.delete({ where: { id: report.commentId } });
      } else if (report.postId) {
        await this.prisma.post.delete({ where: { id: report.postId } });
      }
    }

    return updated;
  }
}
