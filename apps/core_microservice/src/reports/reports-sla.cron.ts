import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType, ReportStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReportsSlaCronService {
  private readonly logger = new Logger(ReportsSlaCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async notifySlaBreaches() {
    const now = new Date();
    const reports = await this.prisma.report.findMany({
      where: {
        status: { in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW] },
        dueAt: { lt: now },
        slaNotifiedAt: null,
        assignedModeratorId: { not: null },
      },
      select: {
        id: true,
        reason: true,
        priority: true,
        dueAt: true,
        assignedModeratorId: true,
        postId: true,
        comment: { select: { postId: true } },
      },
    });

    for (const r of reports) {
      const modId = r.assignedModeratorId!;
      try {
        await this.notificationService.create({
          type: NotificationType.SYSTEM,
          recipientId: modId,
          actorId: modId,
          itemId: r.id,
          postId: r.postId ?? r.comment?.postId ?? undefined,
          message: `SLA overdue: report ${r.id.slice(0, 8)}… (priority ${r.priority}). Please review.`,
        });
        await this.prisma.report.update({
          where: { id: r.id },
          data: { slaNotifiedAt: now },
        });
      } catch (e) {
        this.logger.warn(
          `SLA notify failed for report ${r.id}: ${(e as Error).message}`,
        );
      }
    }
  }
}
