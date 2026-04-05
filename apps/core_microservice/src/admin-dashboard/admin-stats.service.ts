import { Injectable } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSnapshot() {
    const now = new Date();

    const [
      accountsByState,
      accountsByRole,
      reportsByStatus,
      reportsOpenOverdue,
      reportsOpen,
    ] = await Promise.all([
      this.prisma.account.groupBy({
        by: ['state'],
        _count: { _all: true },
      }),
      this.prisma.account.groupBy({
        by: ['role'],
        _count: { _all: true },
      }),
      this.prisma.report.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.report.count({
        where: {
          status: { in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW] },
          dueAt: { lt: now },
        },
      }),
      this.prisma.report.count({
        where: {
          status: { in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW] },
        },
      }),
    ]);

    return {
      generatedAt: now.toISOString(),
      accounts: {
        byState: accountsByState.map((r) => ({
          state: r.state,
          count: r._count._all,
        })),
        byRole: accountsByRole.map((r) => ({
          role: r.role,
          count: r._count._all,
        })),
      },
      reports: {
        byStatus: reportsByStatus.map((r) => ({
          status: r.status,
          count: r._count._all,
        })),
        openQueue: reportsOpen,
        openOverdue: reportsOpenOverdue,
      },
    };
  }
}
