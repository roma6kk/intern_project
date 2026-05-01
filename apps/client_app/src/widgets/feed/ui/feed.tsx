'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Loader2, LogIn } from 'lucide-react';
import api from '@/shared/api';
import { PostCard } from '@/widgets/post-card';
import type { Post } from '@/entities/post';
import { useAuth } from '@/entities/session';
import { useInfiniteScroll } from '@/shared/lib/use-infinite-scroll';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';
import type { StoriesFeedGroup } from '@/features/stories/model/types';
import { StoryViewerModal } from '@/features/stories/ui/story-viewer-modal';

interface SuggestionUser {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
}

export function Feed() {
  const { user, isLoading } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestionUser[]>([]);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [followLoadingId, setFollowLoadingId] = useState<string | null>(null);
  const [stories, setStories] = useState<StoriesFeedGroup[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerAuthorId, setViewerAuthorId] = useState<string | undefined>(undefined);
  const [viewerStoryId, setViewerStoryId] = useState<string | undefined>(undefined);
  
  const { 
    items: posts, 
    loading: postsLoading, 
    hasMore, 
    lastElementRef,
    refresh
  } = useInfiniteScroll<Post>({
    endpoint: '/posts/feed',
    limit: 10,
    maxItems: 50
  });

  useEffect(() => {
    if (!isLoading && user) {
      refresh();
    }
  }, [user, refresh, isLoading]);

  useEffect(() => {
    const handler = () => {
      if (!isLoading && user) {
        refresh();
      }
    };

    if (typeof window === 'undefined') return;
    window.addEventListener('post:created', handler);
    return () => window.removeEventListener('post:created', handler);
  }, [user, isLoading, refresh]);

  const loadStories = useCallback(async () => {
    if (!user) return;
    setStoriesLoading(true);
    try {
      const { data } = await api.get('/stories/feed');
      setStories(Array.isArray(data) ? (data as StoriesFeedGroup[]) : []);
    } catch {
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && user) {
      void loadStories();
    }
  }, [user, isLoading, loadStories]);

  const loadSuggestions = useCallback(async (limit: number) => {
    if (!user) return;
    setSuggestionsLoading(true);
    try {
      const { data } = await api.get(`/profiles/suggestions?limit=${limit}`);
      const list: SuggestionUser[] = (data || []).map((p: { userId: string; avatarUrl?: string | null; user?: { account?: { username?: string } } }) => ({
        id: p.userId,
        userId: p.userId,
        username: p.user?.account?.username || 'Unknown',
        avatarUrl: p.avatarUrl ?? null,
      }));
      setSuggestions(list);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && user) {
      loadSuggestions(3);
    }
  }, [user, isLoading, loadSuggestions]);

  const handleExpandSuggestions = () => {
    if (suggestionsExpanded) {
      setSuggestionsExpanded(false);
      loadSuggestions(3);
    } else {
      setSuggestionsExpanded(true);
      loadSuggestions(10);
    }
  };

  const handleFollowSuggestion = async (userId: string) => {
    if (followLoadingId || !user) return;
    setFollowLoadingId(userId);
    try {
      await api.post(`/follows/${userId}`);
      setSuggestions((prev) => prev.filter((s) => s.userId !== userId));
    } catch {
      // ignore
    } finally {
      setFollowLoadingId(null);
    }
  };

  const normalizedPosts = useMemo(() => {
    return posts.map((p: Post) => {
      const author = p.author || { id: p.authorId };
      const username =
        author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
      const profile = author.profile || {};
      return { ...p, author: { ...author, id: author.id || p.authorId, username, profile } };
    });
  }, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <LogIn className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium text-center">Войдите, чтобы просматривать ленту</p>
          <Link href="/login" className="text-primary hover:opacity-90 font-medium text-sm">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto py-2 sm:py-4 grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6">
        <div className="xl:col-span-8">
          <div className={cn(surface.card, animations.slideUp, 'p-4 sm:p-5 mb-6 rika-glow-edge')}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Stories</h2>
              <Link href="/stories/manage" className="text-sm text-primary font-medium hover:opacity-80">
                Manage
              </Link>
            </div>

            <div className="flex gap-4 py-2 overflow-x-auto flex-nowrap snap-x snap-mandatory">
              <Link href="/stories/manage" className="shrink-0 text-center w-20">
                <div className="w-14 h-14 rounded-full overflow-hidden mx-auto border-2 border-primary shadow-[0_8px_20px_-12px_var(--primary)]">
                  <Image
                    src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                    alt={user?.username || 'You'}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs mt-1 truncate text-muted-foreground">Your story</div>
              </Link>

              {storiesLoading ? (
                <div className="flex items-center text-xs text-muted-foreground px-2">
                  Loading…
                </div>
              ) : (
                (stories || []).slice(0, 10).map((g, index) => {
                  const a = g.author;
                  const ring = g.hasUnseen ? 'border-fuchsia-400' : 'border-muted';
                  return (
                    <button
                      key={`story-${a?.id}-${index}`}
                      type="button"
                      onClick={() => {
                        setViewerAuthorId(a?.id);
                        setViewerStoryId(g?.stories?.[0]?.id);
                        setViewerOpen(true);
                      }}
                      className="shrink-0 text-center w-20 snap-start"
                    >
                      <div className={cn('w-14 h-14 rounded-full overflow-hidden mx-auto border-2 shadow-[0_8px_20px_-12px_var(--hero-to)]', ring)}>
                        <Image
                          src={a?.profile?.avatarUrl || '/default-avatar.svg'}
                          alt={a?.username || 'Story'}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs mt-1 truncate text-muted-foreground">
                        {a?.username || 'Unknown'}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            {normalizedPosts.map((p, index) => {
              const isLast = index === normalizedPosts.length - 1;
              return (
                <div
                  key={p.id}
                  ref={isLast ? lastElementRef : null}
                >
                  <PostCard post={p} />
                </div>
              );
            })}
            
            {postsLoading && (
              <div className="flex justify-center py-6">
                <div className="bg-card rounded-lg border border-border shadow-sm px-6 py-4 flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Loading posts...</span>
                </div>
              </div>
            )}
            
            {!hasMore && normalizedPosts.length > 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">You have viewed all posts</p>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden xl:block xl:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className={cn(surface.card, animations.slideUp, 'p-4 flex items-center justify-between rika-glow-edge')}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                    alt={user?.username || 'You'}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-muted-foreground">{user?.username || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">{user?.profile?.firstName || ''}</div>
                </div>
              </div>
              <button type="button" className="text-sm text-primary font-medium">
                Switch
              </button>
            </div>

            <div className={cn(surface.card, animations.slideUp, 'p-4 rika-glow-edge')}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-muted-foreground font-semibold">Suggestions For You</div>
                <button
                  onClick={handleExpandSuggestions}
                  className="text-xs text-primary hover:opacity-90 flex items-center gap-0.5"
                >
                  {suggestionsExpanded ? (
                    <>
                      <ChevronUp size={14} /> Свернуть
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} /> Развернуть
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-3">
                {suggestionsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : suggestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">Нет рекомендаций</p>
                ) : (
                  suggestions.map((s) => (
                    <div key={`suggestion-${s.userId}`} className="flex items-center justify-between">
                      <Link
                        href={`/profile/${s.username}`}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <Image src={s.avatarUrl || '/default-avatar.svg'} alt={s.username} width={32} height={32} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm min-w-0">
                          <div className="font-semibold truncate text-muted-foreground">{s.username}</div>
                          <div className="text-xs text-muted-foreground">Suggested</div>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleFollowSuggestion(s.userId)}
                        disabled={followLoadingId === s.userId}
                        className="text-xs text-primary hover:opacity-90 shrink-0 disabled:opacity-50 px-2.5 py-1 rounded-lg bg-primary/10"
                      >
                        {followLoadingId === s.userId ? '...' : 'Follow'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">About · Help · Press · API · Jobs · Privacy · Terms</div>
          </div>
        </aside>
      </div>

      <StoryViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        groups={stories}
        initialAuthorId={viewerAuthorId}
        initialStoryId={viewerStoryId}
        currentUserId={user?.id}
      />
    </div>
  );
}

