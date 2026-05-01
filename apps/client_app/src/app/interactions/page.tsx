'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, User, Bell, Play, Grid, Loader2 } from 'lucide-react';
import api from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

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
  message?: string;
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
  message?: string;
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
    if (notification.type === 'FOLLOW' || notification.type === 'MENTION') {
      const key = notification.id;
      groupedMap.set(key, {
        id: notification.id,
        type: notification.type,
        postId: notification.postId,
        itemId: notification.itemId,
        message: notification.message,
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

    if (notification.type === 'LIKE' || notification.type === 'COMMENT') {
      const key = `${notification.type}-${notification.postId ?? notification.itemId ?? 'unknown'}`;
      const existing = groupedMap.get(key);

      if (existing) {
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

        if (new Date(notification.createdAt) > new Date(existing.createdAt)) {
          existing.createdAt = notification.createdAt;
        }

        if (!notification.isRead) {
          existing.isRead = false;
        }
      } else {
        groupedMap.set(key, {
          id: notification.id,
          type: notification.type,
          postId: notification.postId,
          itemId: notification.itemId,
          message: notification.message,
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
      const key = notification.id;
      groupedMap.set(key, {
        id: notification.id,
        type: notification.type,
        postId: notification.postId,
        itemId: notification.itemId,
        message: notification.message,
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
    LIKE: 'liked',
    COMMENT: 'commented',
    FOLLOW: 'followed you',
    MENTION: 'mentioned you',
    FOLLOW_REQUEST: 'requested follow',
    SYSTEM: 'moderation notice',
  };

  const displayText = typeLabels[n.type] || 'interacted with you';

  const getNotificationLink = () => {
    if (n.type === 'SYSTEM') {
      if (n.postId) return `/post/${n.postId}`;
      return `/profile/${n.actors[0].username}`;
    }
    if (n.type === 'FOLLOW' || n.type === 'FOLLOW_REQUEST') {
      return `/profile/${n.actors[0].username}`;
    }

    const post = n.postId;
    if (post && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION')) {
      return `/post/${post}`;
    }

    return `/profile/${n.actors[0].username}`;
  };

  useEffect(() => {
    const postId = n.postId;
    const shouldLoadPost = postId && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION');

    if (!shouldLoadPost) {
      loadedPostIdRef.current = null;
      queueMicrotask(() => {
        setPostPreview(null);
        setPostLoadFailed(false);
      });
      return;
    }

    if (loadedPostIdRef.current && loadedPostIdRef.current !== postId) {
      queueMicrotask(() => {
        setPostPreview(null);
        setPostLoadFailed(false);
      });
    }

    if (shouldLoadPost && loadedPostIdRef.current !== postId) {
      loadedPostIdRef.current = postId;
      api
        .get<PostPreview>(`/posts/${postId}`)
        .then((res) => {
          if (loadedPostIdRef.current === postId && res.data) {
            setPostPreview(res.data);
          }
        })
        .catch(() => {
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
    if (n.type === 'SYSTEM') {
      return (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Moderation
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {n.message || 'System notification'}
          </p>
          <p className="text-xs text-muted-foreground">
            From moderator @{n.actors[0].username}
          </p>
        </div>
      );
    }
    if (n.count === 1) {
      return (
        <>
          <span className="font-semibold text-muted-foreground">
            {n.actors[0].username}
          </span>{' '}
          <span className="text-muted-foreground">{displayText}</span>
        </>
      );
    } else {
      const othersCount = n.count - 1;
      return (
        <>
          <span className="font-semibold text-muted-foreground">
            {n.actors[0].username}
          </span>{' '}
          <span className="text-muted-foreground">
            and {othersCount} {othersCount === 1 ? 'other' : 'others'}{' '}
            {displayText}
          </span>
        </>
      );
    }
  };

  const showPostPreview = postPreview && (n.type === 'LIKE' || n.type === 'COMMENT' || n.type === 'MENTION');

  const content = (
    <div
      className={cn(
        'flex items-start gap-4 w-full py-4 px-3 rounded-2xl transition-all',
        !n.isRead ? 'bg-primary/10 hover:bg-primary/15 ring-1 ring-primary/15' : 'hover:bg-muted/50'
      )}
      
    >
      <div className="w-12 h-12 rounded-full overflow-hidden bg-card shadow-sm flex items-center justify-center hover:opacity-80 flex-shrink-0">
        {n.actors[0].avatarUrl ? (
          <Image
            src={n.actors[0].avatarUrl}
            alt={n.actors[0].username}
            width={48}
            height={48}
            className="object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-muted-foreground" />
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
              className="text-xs font-medium text-primary px-3 py-1.5 hover:bg-primary/10 rounded-md transition-colors flex-shrink-0"
            >
              Read
            </button>
          )}
          {n.isFollowRequest && n.followRequestId && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAcceptFollowRequest?.(n.followRequestId!);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded text-sm hover:opacity-90"
                aria-label={`Accept ${n.actors[0].username}`}
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRejectFollowRequest?.(n.followRequestId!);
                }}
                className="flex items-center gap-1 px-3 py-1.5 border rounded text-sm text-foreground hover:bg-muted/50"
                aria-label={`Decline ${n.actors[0].username}`}
              >
                <X className="w-4 h-4" />
                Decline
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="text-xs text-muted-foreground">
            {new Date(n.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
        </div>
      </div>
      {showPostPreview && (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative border border-border">
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
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Grid className="w-8 h-8 text-muted-foreground" />
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

        const unreadIds = newNotifications
          .filter((n) => !n.isRead)
          .map((n) => n.id);
        if (unreadIds.length > 0) {
          void Promise.all(
            unreadIds.map((id) =>
              api.patch(`/notification/${id}`, { isRead: true }).catch(() => {}),
            ),
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

  const loadNotificationsRef = useRef(loadNotifications);
  loadNotificationsRef.current = loadNotifications;

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoading(true);
      try {
        await loadRequests();
        await loadNotificationsRef.current(false);
      } catch (error) {
        console.error('Error loading interactions:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void init();

    return () => {
      mounted = false;
    };
    // Mount only. Depending on `loadNotifications` re-runs after each fetch (cursor/hasMore/loadingMore) and keeps loading stuck.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const followRequestNotifications = requests.map((req) =>
      convertFollowRequestToNotification(req)
    );

    const allNotifications = [...notifications, ...followRequestNotifications];
    const grouped = groupNotifications(allNotifications);

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
    <div className="min-h-screen bg-transparent">
      <div className="border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-xl font-semibold text-foreground">Interactions</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 pb-20 md:pb-2">
        <div className={cn(surface.card, animations.slideUp, 'rounded-3xl p-2 rika-glow-edge')}>


          <div className="px-4 py-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-card rounded-lg border border-border shadow-sm px-6 py-4 flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading notifications...</span>
                </div>
              </div>
            ) : groupedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">No notifications</p>
                <p className="text-sm text-muted-foreground mt-1">New notifications will appear here</p>
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
                      className="text-sm text-primary hover:opacity-80 font-medium"
                    >
                      Show all ({groupedNotifications.length - displayLimit}{' '}
                      more)
                    </button>
                  </div>
                )}
                {displayLimit >= groupedNotifications.length && hasMore && (
                  <div ref={lastElementRef} className="h-10" />
                )}
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading...</span>
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
