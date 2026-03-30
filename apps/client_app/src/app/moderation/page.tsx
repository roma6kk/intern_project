'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/entities/session';
import {
  assignReport,
  listReports,
  updateReport,
  updateReportPriority,
  type ListReportsParams,
  type ModerationAction,
  type ReportPriority,
  type ReportStatus,
} from '@/entities/report';
import {
  ExternalLink,
  Filter,
  Flag,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

type AccountRef = { username: string } | null;
type ReportItem = {
  id: string;
  reason: string;
  status: ReportStatus;
  priority?: ReportPriority;
  postId: string | null;
  commentId: string | null;
  createdAt: string;
  dueAt?: string | null;
  assignedModeratorId?: string | null;
  reporter: {
    id: string;
    account: AccountRef;
  };
  assignedModerator?: {
    id: string;
    account: AccountRef;
  } | null;
  post: {
    id: string;
    authorId: string;
    description: string | null;
    isHidden: boolean;
    author: { id: string; account: AccountRef };
  } | null;
  comment: {
    id: string;
    authorId: string;
    postId: string;
    content: string;
    isHidden: boolean;
    author: { id: string; account: AccountRef };
  } | null;
};

function profileHref(account: AccountRef): string | null {
  if (account?.username) return `/profile/${encodeURIComponent(account.username)}`;
  return null;
}

function targetFromReport(report: ReportItem) {
  if (report.comment) {
    return {
      label: 'Author (reported)',
      href: profileHref(report.comment.author.account),
      username: report.comment.author.account?.username ?? report.comment.authorId.slice(0, 8),
    };
  }
  if (report.post) {
    return {
      label: 'Author (reported)',
      href: profileHref(report.post.author.account),
      username: report.post.author.account?.username ?? report.post.authorId.slice(0, 8),
    };
  }
  return null;
}

function postViewHref(report: ReportItem): string | null {
  if (report.comment?.postId) return `/post/${report.comment.postId}`;
  if (report.post?.id) return `/post/${report.post.id}`;
  return null;
}

function contentPreview(report: ReportItem): string {
  if (report.comment?.content) {
    const t = report.comment.content.trim();
    return t.length > 200 ? `${t.slice(0, 200)}…` : t;
  }
  if (report.post?.description) {
    const t = report.post.description.trim();
    return t.length > 200 ? `${t.slice(0, 200)}…` : t;
  }
  return '(no text)';
}

function isOverdue(report: ReportItem): boolean {
  if (!report.dueAt) return false;
  if (report.status !== 'OPEN' && report.status !== 'IN_REVIEW') return false;
  return new Date(report.dueAt) < new Date();
}

function priorityAccent(p: ReportPriority | undefined): string {
  switch (p ?? 'NORMAL') {
    case 'HIGH':
      return 'border-l-rose-500 ring-rose-500/10';
    case 'LOW':
      return 'border-l-slate-300 ring-slate-500/5';
    default:
      return 'border-l-amber-400 ring-amber-500/10';
  }
}

export default function ModerationPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [warnReportId, setWarnReportId] = useState<string | null>(null);
  const [warnReason, setWarnReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReportStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<ReportPriority | ''>('');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterMine, setFilterMine] = useState(false);

  const canModerate = user?.role === 'MODERATOR' || user?.role === 'ADMIN';

  const buildParams = useCallback((): ListReportsParams => {
    const p: ListReportsParams = {};
    if (filterStatus) p.status = filterStatus;
    if (filterPriority) p.priority = filterPriority;
    if (filterOverdue) p.overdue = true;
    if (filterMine && user?.id) p.assignedModeratorId = user.id;
    return p;
  }, [filterStatus, filterPriority, filterOverdue, filterMine, user?.id]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listReports(buildParams());
      setReports(data as ReportItem[]);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    if (!canModerate) {
      setLoading(false);
      return;
    }
    void loadReports();
  }, [canModerate, loadReports]);

  const runUpdate = async (
    id: string,
    status: ReportStatus,
    action: ModerationAction,
    extra?: { resolutionNote?: string; warningReason?: string },
  ) => {
    setBusyId(id);
    try {
      await updateReport(id, { status, action, ...extra });
      await loadReports();
    } finally {
      setBusyId(null);
    }
  };

  const onResolve = async (
    id: string,
    status: ReportStatus,
    action: ModerationAction,
  ) => {
    await runUpdate(id, status, action);
  };

  const onDeletePost = async (report: ReportItem) => {
    if (
      !confirm(
        'Delete this post or comment permanently? This cannot be undone.',
      )
    ) {
      return;
    }
    await runUpdate(report.id, 'RESOLVED', 'DELETE');
  };

  const submitWarn = async () => {
    if (!warnReportId) return;
    const reason = warnReason.trim() || 'Violation warning';
    await runUpdate(warnReportId, 'IN_REVIEW', 'WARN', { warningReason: reason });
    setWarnReportId(null);
    setWarnReason('');
  };

  const onAssignSelf = async (reportId: string) => {
    if (!user?.id) return;
    setBusyId(reportId);
    try {
      await assignReport(reportId, { assignedModeratorId: user.id });
      await loadReports();
    } finally {
      setBusyId(null);
    }
  };

  const onUnassign = async (reportId: string) => {
    setBusyId(reportId);
    try {
      await assignReport(reportId, { assignedModeratorId: null });
      await loadReports();
    } finally {
      setBusyId(null);
    }
  };

  const onPriorityChange = async (reportId: string, priority: ReportPriority) => {
    setBusyId(reportId);
    try {
      await updateReportPriority(reportId, { priority });
      await loadReports();
    } finally {
      setBusyId(null);
    }
  };

  if (!canModerate) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground">
        Access denied.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="border-b border-amber-200/40 bg-gradient-to-r from-amber-50/90 to-orange-50/50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
              <Flag className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Moderation queue
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Review reports, set priority and SLA, assign work, take action.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 pb-24">
        <div className={cn(surface.card, animations.slideUp, 'mb-6 flex flex-wrap items-center gap-2 rounded-3xl border border-border/80 p-4 rika-glow-edge')}>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filters
          </div>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span>Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus((e.target.value || '') as ReportStatus | '')}
              className="rounded-lg border border-border bg-muted/50/80 px-2.5 py-1.5 text-sm text-foreground focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">All</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span>Priority</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority((e.target.value || '') as ReportPriority | '')}
              className="rounded-lg border border-border bg-muted/50/80 px-2.5 py-1.5 text-sm text-foreground focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">All</option>
              <option value="HIGH">HIGH</option>
              <option value="NORMAL">NORMAL</option>
              <option value="LOW">LOW</option>
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/50/50 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
            <input
              type="checkbox"
              checked={filterOverdue}
              onChange={(e) => setFilterOverdue(e.target.checked)}
              className="rounded border-border text-amber-600 focus:ring-amber-500"
            />
            Overdue SLA
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/50/50 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted">
            <input
              type="checkbox"
              checked={filterMine}
              onChange={(e) => setFilterMine(e.target.checked)}
              className="rounded border-border text-amber-600 focus:ring-amber-500"
            />
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            Assigned to me
          </label>
        </div>

        {warnReportId && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-foreground">Issue warning</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The user gets a notification with this text and a formal warning in the log.
              </p>
              <textarea
                value={warnReason}
                onChange={(e) => setWarnReason(e.target.value)}
                placeholder="Reason for warning"
                rows={4}
                className="mt-4 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWarnReportId(null);
                    setWarnReason('');
                  }}
                  className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void submitWarn()}
                  disabled={busyId === warnReportId}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {busyId === warnReportId ? 'Saving…' : 'Issue warning'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
            Loading reports…
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center text-muted-foreground">
            No reports match these filters.
          </div>
        ) : (
          <ul className="space-y-5">
            {reports.map((report) => {
              const postHref = postViewHref(report);
              const target = targetFromReport(report);
              const reporterHref = profileHref(report.reporter.account);
              const reporterName =
                report.reporter.account?.username ??
                report.reporter.id.slice(0, 8);
              const isOpen =
                report.status === 'OPEN' || report.status === 'IN_REVIEW';
              const working = busyId === report.id;
              const overdue = isOverdue(report);
              const assigneeName =
                report.assignedModerator?.account?.username ??
                (report.assignedModeratorId
                  ? report.assignedModeratorId.slice(0, 8)
                  : '—');
              const pri = report.priority ?? 'NORMAL';

              return (
                <li
                  key={report.id}
                  className={cn(surface.card, `overflow-hidden rounded-3xl border border-border/80 border-l-4 ring-1 transition-shadow hover:shadow-md ${priorityAccent(report.priority)} ${overdue ? 'ring-rose-500/20' : ''}`)}
                >
                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                      <span
                        className={
                          report.status === 'RESOLVED'
                            ? 'font-semibold text-emerald-700'
                            : report.status === 'REJECTED'
                              ? 'font-medium text-muted-foreground'
                              : 'font-semibold text-amber-800'
                        }
                      >
                        {report.status}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
                        {pri}
                      </span>
                      {overdue && (
                        <span className="rounded-md bg-rose-100 px-2 py-0.5 font-semibold text-rose-800">
                          SLA overdue
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                      {report.dueAt && (
                        <span className="text-muted-foreground">
                          Due {new Date(report.dueAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-muted-foreground">Assigned </span>
                      <span className="text-foreground">@{assigneeName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Priority</span>
                      <select
                        value={pri}
                        disabled={working || !isOpen}
                        onChange={(e) =>
                          void onPriorityChange(report.id, e.target.value as ReportPriority)
                        }
                        className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-medium focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
                      >
                        <option value="LOW">LOW</option>
                        <option value="NORMAL">NORMAL</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                      {isOpen && (
                        <>
                          <button
                            type="button"
                            disabled={working}
                            onClick={() => void onAssignSelf(report.id)}
                            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100 disabled:opacity-50"
                          >
                            Assign to me
                          </button>
                          <button
                            type="button"
                            disabled={working || !report.assignedModeratorId}
                            onClick={() => void onUnassign(report.id)}
                            className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                          >
                            Unassign
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-sm text-foreground">
                      <span className="font-medium text-muted-foreground">Reporter </span>
                      {reporterHref ? (
                        <Link
                          href={reporterHref}
                          className="font-medium text-amber-800 underline-offset-2 hover:underline"
                        >
                          @{reporterName}
                        </Link>
                      ) : (
                        <span className="font-medium">@{reporterName}</span>
                      )}
                    </div>

                    {target && (
                      <div className="text-sm text-foreground">
                        <span className="font-medium text-muted-foreground">{target.label} </span>
                        {target.href ? (
                          <Link
                            href={target.href}
                            className="font-medium text-amber-800 underline-offset-2 hover:underline"
                          >
                            @{target.username}
                          </Link>
                        ) : (
                          <span className="font-medium">@{target.username}</span>
                        )}
                      </div>
                    )}

                    <div className="rounded-xl border border-slate-100 bg-muted/50/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {report.commentId ? 'Comment' : 'Post'}
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                        {contentPreview(report)}
                      </p>
                      {postHref && (
                        <Link
                          href={postHref}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:underline"
                        >
                          Open post
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-muted-foreground">Report reason</div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                        {report.reason}
                      </p>
                    </div>

                    {isOpen && (
                      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          disabled={working}
                          onClick={() => onResolve(report.id, 'IN_REVIEW', 'NONE')}
                          className="rounded-lg bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-900 hover:bg-blue-200 disabled:opacity-50"
                        >
                          In review
                        </button>
                        <button
                          type="button"
                          disabled={working}
                          onClick={() => onResolve(report.id, 'RESOLVED', 'HIDE')}
                          className="rounded-lg bg-orange-100 px-2.5 py-1.5 text-xs font-medium text-orange-900 hover:bg-orange-200 disabled:opacity-50"
                        >
                          Resolve + hide
                        </button>
                        <button
                          type="button"
                          disabled={working}
                          onClick={() => setWarnReportId(report.id)}
                          className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-200 disabled:opacity-50"
                        >
                          Warn user
                        </button>
                        <button
                          type="button"
                          disabled={working}
                          onClick={() => void onDeletePost(report)}
                          className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                        >
                          Delete content
                        </button>
                        <button
                          type="button"
                          disabled={working}
                          onClick={() => onResolve(report.id, 'REJECTED', 'NONE')}
                          className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
