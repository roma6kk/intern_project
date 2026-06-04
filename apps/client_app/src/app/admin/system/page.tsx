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

type ArchitectureCategory = 'gateway' | 'microservice' | 'messaging' | 'database';

type HealthService = {
  id: string;
  label: string;
  category: ArchitectureCategory;
  ok: boolean;
  latencyMs: number;
  statusCode?: number;
  error?: string;
  detail?: string;
  llm?: {
    configured: boolean;
    model?: string;
  };
};

type HealthResponse = {
  checkedAt: string;
  services: HealthService[];
};

const CATEGORY_ORDER: ArchitectureCategory[] = [
  'gateway',
  'microservice',
  'messaging',
  'database',
];

const CATEGORY_LABELS: Record<ArchitectureCategory, string> = {
  gateway: 'Шлюз',
  microservice: 'Микросервисы',
  messaging: 'Брокер сообщений',
  database: 'Хранилища данных',
};

function serviceDisplayName(svc: HealthService): string {
  if (svc.label) return svc.label;
  return svc.id;
}

function groupServicesByCategory(
  services: HealthService[],
): Map<ArchitectureCategory, HealthService[]> {
  const map = new Map<ArchitectureCategory, HealthService[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const svc of services) {
    const cat = CATEGORY_ORDER.includes(svc.category)
      ? svc.category
      : 'microservice';
    map.get(cat)!.push(svc);
  }
  return map;
}

function isStatsSnapshot(x: unknown): x is StatsSnapshot {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.generatedAt === 'string' &&
    o.accounts != null &&
    o.reports != null
  );
}

function normalizeHealthService(raw: unknown): HealthService | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Record<string, unknown>;
  const id =
    typeof s.id === 'string'
      ? s.id
      : typeof s.name === 'string'
        ? s.name
        : null;
  if (!id || typeof s.ok !== 'boolean' || typeof s.latencyMs !== 'number') {
    return null;
  }
  const category = CATEGORY_ORDER.includes(s.category as ArchitectureCategory)
    ? (s.category as ArchitectureCategory)
    : 'microservice';
  return {
    id,
    label: typeof s.label === 'string' ? s.label : id,
    category,
    ok: s.ok,
    latencyMs: s.latencyMs,
    statusCode: typeof s.statusCode === 'number' ? s.statusCode : undefined,
    error: typeof s.error === 'string' ? s.error : undefined,
    detail: typeof s.detail === 'string' ? s.detail : undefined,
    llm:
      s.llm && typeof s.llm === 'object'
        ? (s.llm as HealthService['llm'])
        : undefined,
  };
}

function parseHealthResponse(x: unknown): HealthResponse | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  if (!Array.isArray(o.services) || typeof o.checkedAt !== 'string') {
    return null;
  }
  const services = o.services
    .map(normalizeHealthService)
    .filter((s): s is HealthService => s != null);
  if (services.length === 0) return null;
  return { checkedAt: o.checkedAt, services };
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
          setHealth(parseHealthResponse(h));
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
        Доступ запрещён.
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
              Система и статистика
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Сводные показатели и состояние всех компонентов архитектуры (только ADMIN).
            </p>
          </div>
          {stats && (
            <p className="text-xs text-muted-foreground">
              Обновлено{' '}
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
            Загрузка метрик…
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
                          Открытая очередь
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
                          Просрочен SLA
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
                          Снимок по жалобам
                        </p>
                        <p className="text-sm text-muted-foreground">
                          OPEN / IN_REVIEW и просрочка помогают понять нагрузку на очередь.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            OPEN: {openReports}
                          </span>
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            IN_REVIEW: {inReviewReports}
                          </span>
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                            Просрочено: {stats.reports.openOverdue}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            RESOLVED: {resolvedReports}
                          </span>
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                            REJECTED: {rejectedReports}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {stateRows.length > 0 && (
                    <SimpleDistributionBars title="Аккаунты по состоянию" rows={stateRows} />
                  )}
                  {roleRows.length > 0 && (
                    <SimpleDistributionBars title="Аккаунты по ролям" rows={roleRows} />
                  )}
                  {reportStatusRows.length > 0 && (
                    <SimpleDistributionBars title="Жалобы по статусам" rows={reportStatusRows} />
                  )}
                </div>
              </>
            )}

            {!stats && !loading && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Не удалось загрузить статистику. Проверьте сессию и API.
              </p>
            )}

            <section>
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Состояние архитектуры
                </h2>
              </div>
              {health && health.services.length > 0 ? (
                <div className="space-y-8">
                  {CATEGORY_ORDER.map((category) => {
                    const grouped = groupServicesByCategory(health.services);
                    const items = grouped.get(category) ?? [];
                    if (items.length === 0) return null;
                    const unhealthy = items.filter((s) => !s.ok).length;
                    return (
                      <div key={category}>
                        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            {CATEGORY_LABELS[category]}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {items.length - unhealthy}/{items.length} доступно
                          </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {items.map((svc) => (
                    <div
                      key={svc.id}
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
                          <p className="text-sm font-medium text-foreground">
                            {serviceDisplayName(svc)}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {svc.id}
                          </p>
                          {svc.detail && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {svc.detail}
                            </p>
                          )}
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
                          {svc.ok ? 'OK' : 'Ошибка'}
                        </p>
                      </div>
                    </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !loading && (
                  <p className="text-sm text-muted-foreground">Нет данных о состоянии.</p>
                )
              )}
              {health && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Проверено:{' '}
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
