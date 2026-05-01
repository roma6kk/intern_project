'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getAdminStats,
  getAdminSystemHealth,
} from '@/entities/admin-dashboard';
import { useAuth } from '@/entities/session';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Loader2,
  Server,
  XCircle,
} from 'lucide-react';
import { SimpleDistributionBars } from '@/widgets/admin-charts/SimpleDistributionBars';
import type { DistributionRow } from '@/widgets/admin-charts/SimpleDistributionBars';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

type StatsSnapshot = {
  generatedAt: string;
  accounts: {
    byState: { state: string; count: number }[];
    byRole: { role: string; count: number }[];
  };
  reports: {
    byStatus: { status: string; count: number }[];
    openQueue: number;
    openOverdue: number;
  };
};

type HealthResponse = {
  checkedAt: string;
  services: {
    name: string;
    ok: boolean;
    latencyMs: number;
    statusCode?: number;
    error?: string;
    llm?: {
      configured: boolean;
      model?: string;
    };
  }[];
};

function isStatsSnapshot(x: unknown): x is StatsSnapshot {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.generatedAt === 'string' &&
    o.accounts != null &&
    o.reports != null
  );
}

function isHealthResponse(x: unknown): x is HealthResponse {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return Array.isArray(o.services) && typeof o.checkedAt === 'string';
}

export default function AdminSystemPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsSnapshot | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [s, h] = await Promise.all([
          getAdminStats(),
          getAdminSystemHealth(),
        ]);
        if (!cancelled) {
          setStats(isStatsSnapshot(s) ? s : null);
          setHealth(isHealthResponse(h) ? h : null);
        }
      } catch {
        if (!cancelled) {
          setStats(null);
          setHealth(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground">
        Access denied.
      </div>
    );
  }

  const stateRows: DistributionRow[] =
    stats?.accounts.byState.map((r) => ({
      label: r.state,
      value: r.count,
    })) ?? [];

  const roleRows: DistributionRow[] =
    stats?.accounts.byRole.map((r) => ({
      label: r.role,
      value: r.count,
    })) ?? [];

  const reportStatusRows: DistributionRow[] =
    stats?.reports.byStatus.map((r) => ({
      label: r.status,
      value: r.count,
    })) ?? [];
  const reportStatusCounts = new Map(
    stats?.reports.byStatus.map((r) => [r.status, r.count]) ?? [],
  );
  const openReports = reportStatusCounts.get('OPEN') ?? 0;
  const inReviewReports = reportStatusCounts.get('IN_REVIEW') ?? 0;
  const resolvedReports = reportStatusCounts.get('RESOLVED') ?? 0;
  const rejectedReports = reportStatusCounts.get('REJECTED') ?? 0;

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-8 pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
            >
              ← Admin
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              System &amp; statistics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Aggregated counts and health checks (ADMIN only).
            </p>
          </div>
          {stats && (
            <p className="text-xs text-muted-foreground">
              Updated{' '}
              {new Date(stats.generatedAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-8 text-muted-foreground shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            Loading metrics…
          </div>
        ) : (
          <div className="space-y-10">
            {stats && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className={cn(surface.card, animations.slideUp, 'rounded-2xl border border-border/80 p-5 transition-shadow hover:shadow-md')}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Open queue
                        </p>
                        <p className="text-2xl font-semibold tabular-nums text-foreground">
                          {stats.reports.openQueue}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={cn(surface.card, animations.slideUp, 'rounded-2xl border border-border/80 p-5 transition-shadow hover:shadow-md')}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          SLA overdue
                        </p>
                        <p className="text-2xl font-semibold tabular-nums text-foreground">
                          {stats.reports.openOverdue}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={cn(surface.card, animations.slideUp, 'rounded-2xl border border-border/80 p-5 transition-shadow hover:shadow-md sm:col-span-2')}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Reports snapshot
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Open / in-review vs overdue helps spot queue pressure.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            Open: {openReports}
                          </span>
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            In review: {inReviewReports}
                          </span>
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                            Overdue: {stats.reports.openOverdue}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Resolved: {resolvedReports}
                          </span>
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                            Rejected: {rejectedReports}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {stateRows.length > 0 && (
                    <SimpleDistributionBars title="Accounts by state" rows={stateRows} />
                  )}
                  {roleRows.length > 0 && (
                    <SimpleDistributionBars title="Accounts by role" rows={roleRows} />
                  )}
                  {reportStatusRows.length > 0 && (
                    <SimpleDistributionBars title="Reports by status" rows={reportStatusRows} />
                  )}
                </div>
              </>
            )}

            {!stats && !loading && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Could not load statistics. Check your session and API.
              </p>
            )}

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Service checks</h2>
              </div>
              {health && health.services.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {health.services.map((svc) => (
                    <div
                      key={svc.name}
                      className={cn(surface.card, animations.slideUp, 'flex items-start justify-between gap-3 rounded-xl border border-border/80 p-4 transition-shadow hover:shadow-md')}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={
                            svc.ok
                              ? 'mt-0.5 text-emerald-600'
                              : 'mt-0.5 text-rose-600'
                          }
                        >
                          {svc.ok ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 shrink-0" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-medium text-foreground">
                            {svc.name}
                          </p>
                          {svc.error && (
                            <p className="mt-1 break-words text-xs text-rose-600">{svc.error}</p>
                          )}
                          {svc.statusCode != null && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              HTTP {svc.statusCode}
                            </p>
                          )}
                          {svc.llm && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              LLM:{' '}
                              {svc.llm.configured
                                ? 'подключена'
                                : 'не подключена'}
                              {svc.llm.model ? ` (${svc.llm.model})` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-sm tabular-nums text-foreground">
                          {svc.latencyMs}ms
                        </p>
                        <p
                          className={
                            svc.ok ? 'text-xs text-emerald-600' : 'text-xs text-rose-600'
                          }
                        >
                          {svc.ok ? 'OK' : 'Fail'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && (
                  <p className="text-sm text-muted-foreground">No health data available.</p>
                )
              )}
              {health && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Checked at{' '}
                  {new Date(health.checkedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
