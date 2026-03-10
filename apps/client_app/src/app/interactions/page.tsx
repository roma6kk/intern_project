'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, User, Bell, Play, Grid, Loader2 } from 'lucide-react';
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

interface GroupedNotification {
  id: string;
  type: string;
  postId?: string;
  itemId?: string;
  actors: Array<{
    id: string;
    username: string;
    avatarUrl: string | null;
  }>;
  count: number;
  isRead: boolean;
  createdAt: string;
  isFollowRequest?: boolean;
  followRequestId?: string;
}

interface PostPreview {
  id: string;
  description?: string;
  assets?: Array<{
    id: string;
    url: string;
    type?: string;
  }>;
}

interface PaginationResponse<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasNextPage: boolean;
    limit: number;
    total?: number;
  };
}

const INITIAL_DISPLAY_LIMIT = 10;
const PAGE_SIZE = 20;

function groupNotifications(notifications: Notification[]): GroupedNotification[] {
  const groupedMap = new Map<string, GroupedNotification>();

  notifications.forEach((notification) => {
    // Для FOLLOW и MENTION не группируем
    if (notification.type === 'FOLLOW' || notification.type === 'MENTION') {
      const key = notification.id;
      groupedMap.set(key, {
        id: notification.id,
        type: notification.type,
        postId: notification.postId,
        itemId: notification.itemId,
        actors: [
          {
            id: notification.actor.id,
            username: notification.actor.account.username,
            avatarUrl: notification.actor.profile.avatarUrl,
          },
        ],
        count: 1,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
      return;
    }

    // Для LIKE и COMMENT группируем по postId/itemId
    if (notification.type === 'LIKE' || notification.type === 'COMMENT') {
      const key = `${notification.type}-${notification.postId ?? notification.itemId ?? 'unknown'}`;
      const existing = groupedMap.get(key);

      if (existing) {
        // Проверяем, нет ли уже этого актора в группе
        const actorExists = existing.actors.some(
          (a) => a.id === notification.actor.id
        );

        if (!actorExists) {
          existing.actors.push({
            id: notification.actor.id,
            username: notification.actor.account.username,
            avatarUrl: notification.actor.profile.avatarUrl,
          });
          existing.count++;
        }

        // Обновляем время на самое позднее
        if (new Date(notification.createdAt) > new Date(existing.createdAt)) {
          existing.createdAt = notification.createdAt;
        }

        // Если хотя бы одно уведомление не прочитано, группа не прочитана
        if (!notification.isRead) {
          existing.isRead = false;
        }
      } else {
        groupedMap.set(key, {
          id: notification.id,
          type: notification.type,
          postId: notification.postId,
          itemId: notification.itemId,
          actors: [
            {
              id: notification.actor.id,
              username: notification.actor.account.username,
              avatarUrl: notification.actor.profile.avatarUrl,
            },
          ],
          count: 1,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        });
      }
    } else {
      // Для остальных типов не группируем
      const key = notification.id;
      groupedMap.set(key, {
        id: notification.id,
        type: notification.type,
        postId: notification.postId,
        itemId: notification.itemId,
        actors: [
          {
            id: notification.actor.id,
            username: notification.actor.account.username,
            avatarUrl: notification.actor.profile.avatarUrl,
          },
        ],
        count: 1,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    }
  });

  return Array.from(groupedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function convertFollowRequestToNotification(
  request: FollowRequest
): Notification {
  return {
    id: `follow-request-${request.id}`,
    type: 'FOLLOW_REQUEST',
    message: 'запросил подписку',
    isRead: false,
    createdAt: new Date().toISOString(),
    actor: {
      id: request.id,
      account: { username: request.username },
      profile: {
        firstName: request.name || '',
        avatarUrl: request.avatarUrl || null,
      },
    },
  };
}

interface NotificationItemProps {
  n: GroupedNotification;
  onMarkRead: (id: string) => Promise<void>;
  onAcceptFollowRequest?: (id: string) => void;
  onRejectFollowRequest?: (id: string) => void;
}

function NotificationItem({
  n,
  onMarkRead,
  onAcceptFollowRequest,
  onRejectFollowRequest,
}: NotificationItemProps) {
  const [postPreview, setPostPreview] = useState<PostPreview | null>(null);
  const [, setPostLoadFailed] = useState(false);
  const loadedPostIdRef = useRef<string | null>(null);

  const typeLabels: Record<string, string> = {
    LIKE: 'лайкнул',
    COMMENT: 'прокомментировал',
    FOLLOW: 'подписался на вас',
    MENTION: 'упомянул вас',
    FOLLOW_REQUEST: 'запросил подписку',
  };

  const displayText = typeLabels[n.type] || 'взаимодействовал с вами';

  const getNotificationLink = () => {
    if (n.type === 'FOLLOW' || n.type === 'FOLLOW_REQUEST') {
      return `/profile/${n.actors[0].username}`;
    }

    // Используем postId для ссылки на пост (itemId может быть ID комментария)
    const post = n.postId;
    if (post && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION')) {
      return `/post/${post}`;
    }

    return `/profile/${n.actors[0].username}`;
  };

  // Загружаем предпросмотр поста для уведомлений, которые ссылаются на пост
  // Используем только postId, так как itemId может быть ID комментария для лайков на комментарии
  useEffect(() => {
    const postId = n.postId; // Используем только postId, не itemId
    const shouldLoadPost = postId && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION');

    // Сбрасываем состояние при изменении postId или если не нужно загружать
    if (!shouldLoadPost) {
      loadedPostIdRef.current = null;
      queueMicrotask(() => {
        setPostPreview(null);
        setPostLoadFailed(false);
      });
      return;
    }

    // Если postId изменился, сбрасываем состояние
    if (loadedPostIdRef.current && loadedPostIdRef.current !== postId) {
      queueMicrotask(() => {
        setPostPreview(null);
        setPostLoadFailed(false);
      });
    }

    // Загружаем только один раз для каждого postId
    if (shouldLoadPost && loadedPostIdRef.current !== postId) {
      loadedPostIdRef.current = postId;
      api
        .get<PostPreview>(`/posts/${postId}`)
        .then((res) => {
          // Проверяем, что postId не изменился во время загрузки
          // Загружаем пост даже если нет медиа, чтобы показать текстовый предпросмотр
          if (loadedPostIdRef.current === postId && res.data) {
            setPostPreview(res.data);
          }
        })
        .catch(() => {
          // Помечаем, что загрузка не удалась только если postId не изменился
          // Это нормально, если пост был удален или недоступен
          if (loadedPostIdRef.current === postId) {
            setPostLoadFailed(true);
          }
        });
    }
  }, [n.postId, n.type]);

  const isVideoAsset = (asset?: { url: string; type?: string }) => {
    if (!asset?.url) return false;
    if (asset.type === 'VIDEO') return true;
    return /\.(mp4|webm|ogg|mov)$/i.test(asset.url);
  };

  const firstAsset = postPreview?.assets?.[0];
  const isVideo = firstAsset ? isVideoAsset(firstAsset) : false;
  const hasMedia = firstAsset !== undefined;

  const getDisplayText = () => {
    if (n.count === 1) {
      return (
        <>
          <span className="font-semibold text-gray-500">
            {n.actors[0].username}
          </span>{' '}
          <span className="text-gray-600">{displayText}</span>
        </>
      );
    } else {
      const othersCount = n.count - 1;
      return (
        <>
          <span className="font-semibold text-gray-500">
            {n.actors[0].username}
          </span>{' '}
          <span className="text-gray-600">
            и {othersCount} {othersCount === 1 ? 'другой' : 'других'}{' '}
            {displayText}
          </span>
        </>
      );
    }
  };

  const showPostPreview = postPreview && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION');

  const content = (
    <div
      className={`flex items-start gap-4 w-full py-4 px-3 rounded-lg transition-colors ${
        !n.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center hover:opacity-80 flex-shrink-0">
        {n.actors[0].avatarUrl ? (
          <Image
            src={n.actors[0].avatarUrl}
            alt={n.actors[0].username}
            width={48}
            height={48}
            className="object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm leading-relaxed flex-1 min-w-0">{getDisplayText()}</div>
          {!n.isRead && !n.isFollowRequest && (
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
          {n.isFollowRequest && n.followRequestId && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAcceptFollowRequest?.(n.followRequestId!);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                aria-label={`Accept ${n.actors[0].username}`}
              >
                <Check className="w-4 h-4" />
                Принять
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRejectFollowRequest?.(n.followRequestId!);
                }}
                className="flex items-center gap-1 px-3 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-50"
                aria-label={`Decline ${n.actors[0].username}`}
              >
                <X className="w-4 h-4" />
                Отклонить
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="text-xs text-gray-500">
            {new Date(n.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
        </div>
      </div>
      {showPostPreview && (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-200">
          {hasMedia ? (
            isVideo ? (
              <>
                <video
                  src={firstAsset.url}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedData={(e) => {
                    const v = e.currentTarget;
                    v.pause();
                    try {
                      v.currentTime = 0;
                    } catch {}
                  }}
                  onError={(e) => {
                    const v = e.currentTarget;
                    v.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </>
            ) : (
              <Image
                src={firstAsset.url}
                alt="Post preview"
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
                onError={() => {}}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Grid className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (n.isFollowRequest) {
    return <div>{content}</div>;
  }

  return <Link href={getNotificationLink()}>{content}</Link>;
}

export default function InteractionsPage() {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<
    GroupedNotification[]
  >([]);
  const [displayLimit, setDisplayLimit] = useState<number>(
    INITIAL_DISPLAY_LIMIT
  );
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const isExpandedRef = useRef<boolean>(false);

  const loadNotifications = useCallback(
    async (append: boolean = false) => {
      if (loadingMore || (!hasMore && append)) return;

      setLoadingMore(true);
      try {
        const params = new URLSearchParams();
        params.set('limit', String(PAGE_SIZE));
        if (cursor) {
          params.set('cursor', cursor);
        }

        const res = await api.get<PaginationResponse<Notification>>(
          `/notification/me?${params.toString()}`
        );

        const newNotifications = res.data.data || [];
        const meta = res.data.meta;

        setNotifications((prev) => {
          if (append) {
            // Объединяем, избегая дубликатов
            const existingIds = new Set(prev.map((n) => n.id));
            const unique = newNotifications.filter(
              (n) => !existingIds.has(n.id)
            );
            return [...prev, ...unique];
          }
          return newNotifications;
        });

        setHasMore(Boolean(meta.hasNextPage));
        setCursor(meta.cursor ?? null);

        // Автоматически отмечаем как прочитанные
        const unreadIds = newNotifications
          .filter((n) => !n.isRead)
          .map((n) => n.id);
        if (unreadIds.length > 0) {
          await Promise.all(
            unreadIds.map((id) =>
              api.patch(`/notification/${id}`, { isRead: true }).catch(() => {})
            )
          );
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoadingMore(false);
      }
    },
    [hasMore, loadingMore, cursor]
  );

  const loadRequests = useCallback(async () => {
    try {
      const res = await api.get<BackendFollowRequest[]>('/follows/requests/me');
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
    } catch (error) {
      console.error('Error loading follow requests:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      await Promise.all([loadRequests(), loadNotifications(false)]);
      if (mounted) setLoading(false);
    }

    init();

    return () => {
      mounted = false;
    };
  }, [loadNotifications, loadRequests]);

  // Группируем уведомления при изменении
  useEffect(() => {
    const followRequestNotifications = requests.map((req) =>
      convertFollowRequestToNotification(req)
    );

    const allNotifications = [...notifications, ...followRequestNotifications];
    const grouped = groupNotifications(allNotifications);

    // Добавляем информацию о follow requests
    const groupedWithFollowRequests = grouped.map((g) => {
      if (g.type === 'FOLLOW_REQUEST') {
        const request = requests.find(
          (r) => `follow-request-${r.id}` === g.id
        );
        if (request) {
          return {
            ...g,
            isFollowRequest: true,
            followRequestId: request.id,
          };
        }
      }
      return g;
    });

    setGroupedNotifications(groupedWithFollowRequests);
  }, [notifications, requests]);

  useEffect(() => {
    if (isExpandedRef.current && displayLimit < groupedNotifications.length) {
      setDisplayLimit(groupedNotifications.length);
    }
  }, [groupedNotifications.length, displayLimit]);

  useEffect(() => {
    if (loadingMore || !hasMore || displayLimit < groupedNotifications.length) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadNotifications(true);
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadNotifications, displayLimit, groupedNotifications.length]);

  const displayedNotifications = groupedNotifications.slice(0, displayLimit);
  const hasMoreToShow = displayLimit < groupedNotifications.length;

  async function handleAction(id: string, action: 'accept' | 'decline') {
    setRequests((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.patch(`/follows/requests/${id}/${action}`);
    } catch (error) {
      console.error('Error handling follow request:', error);
    }
  }

  const accept = (id: string) => handleAction(id, 'accept');
  const reject = (id: string) => handleAction(id, 'decline');

  const handleMarkRead = async (groupedId: string) => {
    try {
      const grouped = groupedNotifications.find((g) => g.id === groupedId);
      if (!grouped) return;

      if (grouped.type === 'LIKE' || grouped.type === 'COMMENT') {
        const relatedNotifications = notifications.filter(
          (n) =>
            n.type === grouped.type &&
            (n.postId ?? n.itemId) === (grouped.postId ?? grouped.itemId)
        );

        await Promise.all(
          relatedNotifications.map((n) =>
            api.patch(`/notification/${n.id}`, { isRead: true }).catch(() => {})
          )
        );

        setNotifications((prev) =>
          prev.map((x) =>
            relatedNotifications.some((n) => n.id === x.id)
              ? { ...x, isRead: true }
              : x
          )
        );
      } else {
        const notification = notifications.find((n) => n.id === groupedId);
        if (notification) {
          await api.patch(`/notification/${groupedId}`, { isRead: true });
          setNotifications((prev) =>
            prev.map((x) => (x.id === groupedId ? { ...x, isRead: true } : x))
          );
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-700">Interactions</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-2">
        <div className="bg-white border rounded-md">


          <div className="px-4 py-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4 flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-600">Загрузка уведомлений...</span>
                </div>
              </div>
            ) : groupedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Нет уведомлений</p>
                <p className="text-sm text-gray-500 mt-1">Здесь появятся новые уведомления</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  {displayedNotifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      n={n}
                      onMarkRead={handleMarkRead}
                      onAcceptFollowRequest={accept}
                      onRejectFollowRequest={reject}
                    />
                  ))}
                </div>
                {hasMoreToShow && (
                  <div className="mt-4 mb-8 md:mb-0 text-center">
                    <button
                      onClick={() => {
                        isExpandedRef.current = true;
                        setDisplayLimit(groupedNotifications.length);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Показать все ({groupedNotifications.length - displayLimit}{' '}
                      еще)
                    </button>
                  </div>
                )}
                {displayLimit >= groupedNotifications.length && hasMore && (
                  <div ref={lastElementRef} className="h-10" />
                )}
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Загрузка...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
