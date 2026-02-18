'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, User, Bell } from 'lucide-react';
import api from '@/lib/api';

interface FollowRequest {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
}

interface BackendFollowRequest {
  follower: {
    id: string;
    account: { username: string };
    profile: {
      firstName: string | null;
      secondName: string | null;
      avatarUrl: string | null;
    } | null;
  };
}

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  itemId?: string;
  postId?: string;
  actor: {
    id: string;
    account: { username: string };
    profile: {
      firstName: string;
      avatarUrl: string | null;
    };
  };
}

interface RequestItemProps {
  r: FollowRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

function RequestItem({ r, onAccept, onReject }: RequestItemProps) {
  return (
    <div className="flex items-center justify-between w-full py-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {r.avatarUrl ? (
            <Image src={r.avatarUrl} alt={r.username} width={48} height={48} />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{r.username}</span>
          <span className="text-xs text-gray-400">{r.name || 'New user'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAccept(r.id)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm"
          aria-label={`Accept ${r.username}`}
        >
          <Check className="w-4 h-4" />
          Accept
        </button>

        <button
          onClick={() => onReject(r.id)}
          className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm text-gray-700"
          aria-label={`Decline ${r.username}`}
        >
          <X className="w-4 h-4" />
          Decline
        </button>
      </div>
    </div>
  );
}

interface NotificationItemProps {
  n: Notification;
  onMarkRead: (id: string) => Promise<void>;
}

function NotificationItem({ n, onMarkRead }: NotificationItemProps) {
  const typeLabels: Record<string, string> = {
    LIKE: 'лайкнул',
    COMMENT: 'прокомментировал',
    FOLLOW: 'подписался на вас',
    MENTION: 'упомянул вас',
  };

  const displayText = typeLabels[n.type] || n.message || 'взаимодействовал с вами';

  const getNotificationLink = () => {
    if (n.type === 'FOLLOW') return `/profile/${n.actor.account.username}`;

    const post = n.postId ?? n.itemId;
    if (post && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION')) {
      return `/post/${post}`;
    }

    return `/profile/${n.actor.account.username}`;
  };


  return (
    <Link href={getNotificationLink()} className={`flex items-start gap-4 w-full py-4 px-3 rounded-lg transition-colors ${
      !n.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
    }`}>
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center hover:opacity-80 flex-shrink-0">
        {n.actor.profile.avatarUrl ? (
          <Image src={n.actor.profile.avatarUrl} alt={n.actor.account.username} width={48} height={48} className="object-cover" />
        ) : (
          <User className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm leading-relaxed">
            <span className="font-semibold text-gray-900">
              {n.actor.account.username}
            </span>{' '}
            <span className="text-gray-600">{displayText}</span>
          </div>
          {!n.isRead && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onMarkRead(n.id);
              }}
              className="text-xs font-medium text-blue-600 px-3 py-1.5 hover:bg-blue-100 rounded-md transition-colors flex-shrink-0"
            >
              Прочитано
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
        </div>
      </div>
    </Link>
  );
}

export default function InteractionsPage() {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadRequests() {
      try {
        const res = await api.get<BackendFollowRequest[]>('/follows/requests/me');
        if (mounted) {
          setRequests(
            res.data.map((req) => ({
              id: req.follower.id,
              username: req.follower.account.username,
              name: req.follower.profile?.firstName
                ? `${req.follower.profile.firstName} ${req.follower.profile.secondName || ''}`.trim()
                : undefined,
              avatarUrl: req.follower.profile?.avatarUrl || undefined,
            }))
          );
        }
      } catch {} finally {
        if (mounted) setLoading(false);
      }
    }

    async function loadNotifications() {
      try {
        const res = await api.get<Notification[]>('/notification/me');
        if (mounted) {
          setNotifications(res.data);
          const unreadIds = res.data.filter(n => !n.isRead).map(n => n.id);
          if (unreadIds.length > 0) {
            await Promise.all(unreadIds.map(id => api.patch(`/notification/${id}`, { isRead: true }).catch(() => {})));
          }
        }
      } catch {}
    
    }

    loadRequests();
    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleAction(id: string, action: 'accept' | 'decline') {
    setRequests((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.patch(`/follows/requests/${id}/${action}`);
    } catch { }
  }

  const accept = (id: string) => handleAction(id, 'accept');
  const reject = (id: string) => handleAction(id, 'decline');

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-700">Interactions</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-md">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Follow requests</h2>
          </div>

          <div className="px-4 py-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No follow requests</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y">
                {requests.map((r) => (
                  <RequestItem key={r.id} r={r} onAccept={accept} onReject={reject} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white border rounded-md">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Notifications</h2>
          </div>

          <div className="px-4 py-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    n={n}
                    onMarkRead={async (id) => {
                      try {
                        await api.patch(`/notification/${id}`, { isRead: true });
                        setNotifications((prev) => prev.map(x => x.id === id ? {...x, isRead: true} : x));
                      } catch { }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
