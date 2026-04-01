'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  createUserWarning,
  getUserAdminHistory,
  suspendUser,
  unsuspendUser,
} from '@/entities/admin-users';
import { useAuth } from '@/entities/session';
import { ArrowLeft, Clock, Loader2, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

type TimelineItem =
  | {
      kind: 'WARNING';
      id: string;
      createdAt: string;
      reason: string;
      actorUsername: string;
    }
  | {
      kind: 'SANCTION';
      id: string;
      createdAt: string;
      reason: string;
      until?: string | Date | null;
      isActive: boolean;
      actorUsername: string;
    }
  | {
      kind: 'LOG';
      id: string;
      createdAt: string;
      actionType: string;
      reason?: string | null;
      metadata?: unknown;
      actorUsername: string;
    };

type History = {
  warnings: Array<{ id: string; reason: string; createdAt: string }>;
  sanctions: Array<{
    id: string;
    reason: string;
    createdAt: string;
    until?: string | null;
    isActive: boolean;
  }>;
  logs: Array<{
    id: string;
    actionType: string;
    createdAt: string;
    reason?: string | null;
  }>;
  timeline?: TimelineItem[];
};

function kindStyles(kind: TimelineItem['kind']) {
  switch (kind) {
    case 'WARNING':
      return 'border-l-amber-500 bg-amber-50/40';
    case 'SANCTION':
      return 'border-l-rose-500 bg-rose-50/30';
    case 'LOG':
      return 'border-l-indigo-500 bg-indigo-50/30';
    default:
      return 'border-l-slate-400 bg-card';
  }
}

function kindLabel(kind: TimelineItem['kind']) {
  switch (kind) {
    case 'WARNING':
      return 'Warning';
    case 'SANCTION':
      return 'Sanction';
    case 'LOG':
      return 'Log';
    default:
      return kind;
  }
}

export default function AdminUserDetailsPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState<History | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = (await getUserAdminHistory(userId)) as History;
      setHistory(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isAdmin) return;
    void loadHistory();
  }, [isAdmin, loadHistory]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground">
        Access denied.
      </div>
    );
  }

  const timeline: TimelineItem[] =
    history?.timeline ??
    (history
      ? [
          ...(history.warnings || []).map((w) => ({
            kind: 'WARNING' as const,
            id: w.id,
            createdAt: w.createdAt,
            reason: w.reason,
            actorUsername: '',
          })),
          ...(history.sanctions || []).map((s) => ({
            kind: 'SANCTION' as const,
            id: s.id,
            createdAt: s.createdAt,
            reason: s.reason,
            until: s.until,
            isActive: s.isActive,
            actorUsername: '',
          })),
          ...(history.logs || []).map((l) => ({
            kind: 'LOG' as const,
            id: l.id,
            createdAt: l.createdAt,
            actionType: l.actionType,
            reason: l.reason,
            actorUsername: '',
          })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      : []);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-3xl px-4 py-8 pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md">
              <ShieldAlert className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                User moderation
              </h1>
              <p className="font-mono text-xs text-muted-foreground">{userId}</p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </Link>
        </div>

        <div className={cn(surface.card, animations.slideUp, 'mb-8 rounded-3xl border border-border p-5 rika-glow-edge')}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Quick actions</h2>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (used for warn / suspend / unsuspend)…"
            className="mb-3 w-full rounded-xl border border-border bg-muted/50/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                await createUserWarning(userId, { reason: reason || 'Manual warning' });
                setReason('');
                await loadHistory();
              }}
              className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-950 transition-colors hover:bg-amber-200/90"
            >
              Warn
            </button>
            <button
              type="button"
              onClick={async () => {
                const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                await suspendUser(userId, { until, reason: reason || 'Manual suspension' });
                setReason('');
                await loadHistory();
              }}
              className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-900 transition-colors hover:bg-rose-200/90"
            >
              Suspend 7d
            </button>
            <button
              type="button"
              onClick={async () => {
                await unsuspendUser(userId, { reason: reason || 'Manual unsuspend' });
                setReason('');
                await loadHistory();
              }}
              className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-200/90"
            >
              Unsuspend
            </button>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Timeline</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              Loading history…
            </div>
          ) : timeline.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-muted/50/50 px-4 py-8 text-center text-sm text-muted-foreground">
              No moderation events yet.
            </p>
          ) : (
            <ol className="relative space-y-3 border-l-2 border-border pl-6">
              {timeline.map((item) => (
                <li
                  key={`${item.kind}-${item.id}`}
                  className={cn(surface.card, `relative rounded-r-xl border border-border border-l-4 p-4 text-sm ${kindStyles(item.kind)}`)}
                >
                  <div className="absolute -left-[25px] top-5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-400 shadow-sm" />
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <time dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                    <span className="rounded-md bg-card/80 px-1.5 py-0.5 font-semibold text-foreground ring-1 ring-border">
                      {kindLabel(item.kind)}
                    </span>
                    <span className="text-muted-foreground">
                      @{item.actorUsername || 'system'}
                    </span>
                  </div>
                  {item.kind === 'WARNING' && (
                    <p className="text-foreground">{item.reason}</p>
                  )}
                  {item.kind === 'SANCTION' && (
                    <p className="text-foreground">
                      {item.reason}{' '}
                      <span className="text-muted-foreground">
                        — {item.isActive ? 'active' : 'inactive'}
                      </span>
                      {item.until != null && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Until {new Date(item.until).toLocaleString()}
                        </span>
                      )}
                    </p>
                  )}
                  {item.kind === 'LOG' && (
                    <div className="text-foreground">
                      <span className="font-medium text-foreground">{item.actionType}</span>
                      {item.reason && (
                        <p className="mt-1 text-foreground">{item.reason}</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
