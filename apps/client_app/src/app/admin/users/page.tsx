'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  bulkAdminUsers,
  listAdminUsers,
  updateUserRole,
} from '@/entities/admin-users';
import { useAuth } from '@/entities/session';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

type AdminUserRow = {
  userId: string;
  username: string;
  email?: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  state: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  suspendedUntil?: string | null;
};

type AccountApiItem = {
  userId: string;
  username: string;
  email?: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  state: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  suspendedUntil?: string | null;
};

function stateBadgeClass(state: AdminUserRow['state']) {
  switch (state) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-800 ring-emerald-600/15';
    case 'SUSPENDED':
      return 'bg-amber-50 text-amber-900 ring-amber-600/15';
    case 'DELETED':
      return 'bg-muted text-muted-foreground ring-slate-500/10';
    default:
      return 'bg-muted/50 text-foreground ring-slate-500/10';
  }
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkReason, setBulkReason] = useState('');
  const [bulkWorking, setBulkWorking] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAdminUsers({ page: 1, limit: 50 });
      setRows((res.data || []).map((a: AccountApiItem) => ({
        userId: a.userId,
        username: a.username,
        email: a.email,
        role: a.role,
        state: a.state,
        suspendedUntil: a.suspendedUntil,
      })));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    void load();
  }, [isAdmin, load]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.userId)));
    }
  };

  const runBulk = async (action: 'WARN' | 'SUSPEND' | 'UNSUSPEND' | 'ROLE') => {
    const ids = [...selected];
    if (ids.length === 0) {
      setBulkMessage('Выберите хотя бы одного пользователя');
      return;
    }
    const reason = bulkReason.trim() || 'Массовое действие администратора';
    setBulkWorking(true);
    setBulkMessage(null);
    try {
      const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const payload: Parameters<typeof bulkAdminUsers>[0] =
        action === 'WARN'
          ? { userIds: ids, action: 'WARN', warn: { reason } }
          : action === 'SUSPEND'
            ? { userIds: ids, action: 'SUSPEND', suspend: { until, reason } }
            : action === 'UNSUSPEND'
              ? { userIds: ids, action: 'UNSUSPEND', unsuspend: { reason } }
              : {
                  userIds: ids,
                  action: 'ROLE',
                  rolePayload: { role: 'USER', reason },
                };
      const res = await bulkAdminUsers(payload);
      setBulkMessage(
        `Готово: успешно ${res.succeeded.length}, с ошибками ${res.failed.length}`,
      );
      setSelected(new Set());
      await load();
    } catch {
      setBulkMessage('Массовый запрос не выполнен');
    } finally {
      setBulkWorking(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted-foreground">
        Доступ запрещён.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-4xl px-4 py-8 pb-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Пользователи
              </h1>
              <p className="text-sm text-muted-foreground">Аккаунты, роли, массовые действия</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Главная админки
          </Link>
        </div>

        <div className={cn(surface.card, animations.slideUp, 'mb-6 rounded-3xl border border-indigo-100 p-4 ring-1 ring-indigo-500/5 innogram-glow-edge')}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              Массовые действия
              <span className="ml-2 rounded-full bg-card/80 px-2 py-0.5 text-xs font-mono text-muted-foreground ring-1 ring-border">
                выбрано: {selected.size}
              </span>
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {selected.size === rows.length ? 'Снять выделение' : 'Выбрать всех'}
            </button>
          </div>
          <textarea
            value={bulkReason}
            onChange={(e) => setBulkReason(e.target.value)}
            placeholder="Причина для массового предупреждения / блокировки / разблокировки / сброса роли"
            className="mb-3 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['WARN', 'Предупредить', 'bg-amber-100 text-amber-950 hover:bg-amber-200/90'],
                ['SUSPEND', 'Заблокировать на 7 дней', 'bg-rose-100 text-rose-900 hover:bg-rose-200/90'],
                ['UNSUSPEND', 'Разблокировать', 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200/90'],
                ['ROLE', 'Установить роль USER', 'bg-muted text-foreground hover:bg-muted/90'],
              ] as const
            ).map(([action, label, cls]) => (
              <button
                key={action}
                type="button"
                disabled={bulkWorking}
                onClick={() => void runBulk(action)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${cls}`}
              >
                {label}
              </button>
            ))}
          </div>
          {bulkWorking && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Выполняется…
            </p>
          )}
          {bulkMessage && !bulkWorking && (
            <p className="mt-2 text-xs text-muted-foreground">{bulkMessage}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            Загрузка пользователей…
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.userId}
                className={cn(surface.card, animations.slideUp, 'flex gap-3 rounded-2xl border border-border/80 p-4 transition-shadow hover:shadow-md')}
              >
                <input
                  type="checkbox"
                  className="mt-1.5 h-4 w-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                  checked={selected.has(row.userId)}
                  onChange={() => toggle(row.userId)}
                  aria-label={`Select ${row.username}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{row.username}</span>
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${stateBadgeClass(row.state)}`}
                    >
                      {row.state}
                    </span>
                    <span className="text-xs text-muted-foreground">{row.role}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {row.email || 'Нет email'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await updateUserRole(row.userId, {
                          role: row.role === 'USER' ? 'MODERATOR' : 'USER',
                          reason: 'ADMIN_UI_CHANGE',
                        });
                        await load();
                      }}
                      className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-800 transition-colors hover:bg-indigo-100"
                    >
                      Переключить USER / MODERATOR
                    </button>
                    <Link
                      href={`/admin/users/${row.userId}`}
                      className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Детали и история
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
