'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import PostCard from './PostCard';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Feed() {
  const { user, isLoading } = useAuth();
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  
  const { 
    items: posts, 
    loading: postsLoading, 
    hasMore, 
    lastElementRef,
    refresh
  } = useInfiniteScroll<Post>({
    endpoint: '/posts',
    limit: 10,
    maxItems: 50
  });

  // Обновляем посты при смене пользователя
  useEffect(() => {
    if (!isLoading && user) {
      refresh();
    }
  }, [user?.id, refresh, isLoading]);

  useEffect(() => {
    if (!isLoading && user) {
      api.get('/follows/following/me')
        .then((followingRes) => {
          const followingRaw = followingRes.data || [];
          const followingIds = followingRaw.map((f: { following?: { id?: string } }) => f.following?.id).filter(Boolean);
          setFollowingIds(followingIds);
        })
        .catch(() => {
          setFollowingIds([]);
        });
    }
  }, [user, isLoading]);

  // Нормализация постов
  const normalizedPosts = useMemo(() => {
    return posts.map((p: Post) => {
      const author = p.author || { id: p.authorId };
      const username =
        author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
      const profile = author.profile || {};
      return { ...p, author: { ...author, id: author.id || p.authorId, username, profile } };
    });
  }, [posts]);

  // derive story list (unique authors) and suggestions for sidebar
  const storyAuthors = useMemo(() => {
    const seen = new Set<string>();
    const list: { id?: string; username: string; avatarUrl?: string }[] = [];
    for (const p of normalizedPosts) {
      const a = p.author || { id: p.authorId };
      const id = a.id || a.username;
      if (!id || seen.has(id)) continue;
      // only include authors that the current user follows
      if (id && followingIds.length > 0 && !followingIds.includes(id)) continue;
      seen.add(id);
      list.push({ id, username: a.username || 'Unknown', avatarUrl: a.profile?.avatarUrl });
      if (list.length >= 10) break;
    }
    return list;
  }, [normalizedPosts, followingIds]);

  const suggestions = useMemo(() => {
    const suggestions = storyAuthors.filter((s) => s.username !== user?.username).slice(0, 5);
    return suggestions;
  }, [storyAuthors, user]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!isLoading && !user) return <div className="p-4">Please sign in</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border rounded p-4 mb-6 ">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-600">Stories</h2>
              <button className="text-sm text-blue-600">See all</button>
            </div>

            <div className="flex gap-4 overflow-x-auto py-2">
              <div className="shrink-0 text-center w-20 ">
                <Image
                  src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                  alt={user?.username || 'You'}
                  width={56}
                  height={56}
                  className="rounded-full object-cover mx-auto border-2 border-pink-500"
                />
                <div className="text-xs mt-1 truncate text-gray-600">Your story</div>
              </div>

              {storyAuthors.map((a, index) => (
                <div key={`story-${a.id || a.username}-${index}`} className="shrink-0 text-center w-20">
                  <Image
                    src={a.avatarUrl || '/default-avatar.svg'}
                    alt={a.username}
                    width={56}
                    height={56}
                    className="rounded-full object-cover mx-auto border-2 border-yellow-400"
                  />
                  <div className="text-xs mt-1 truncate text-gray-600">{a.username}</div>
                </div>
              ))}
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
            
            {/* Индикатор загрузки */}
            {postsLoading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {/* Сообщение об окончании */}
            {!hasMore && normalizedPosts.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                Вы просмотрели все посты
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded border">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                  alt={user?.username || 'You'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{user?.username || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{user?.profile?.firstName || ''}</div>
                </div>
              </div>
              <button className="text-sm text-blue-600">Switch</button>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500 font-semibold">Suggestions For You</div>
                <button className="text-xs text-gray-400">See All</button>
              </div>

              <div className="space-y-3">
                {suggestions.length === 0 ? (
                  <div className="text-sm text-gray-500">No suggestions</div>
                ) : (
                  suggestions.map((s, index) => (
                    <div key={`suggestion-${s.id || s.username}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image src={s.avatarUrl || '/default-avatar.svg'} alt={s.username} width={32} height={32} className="rounded-full object-cover" />
                        <div className="text-sm">
                          <div className="font-semibold">{s.username}</div>
                          <div className="text-xs text-gray-400">Suggested</div>
                        </div>
                      </div>
                      <button className="text-xs text-blue-600">Follow</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs text-gray-400">About · Help · Press · API · Jobs · Privacy · Terms</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
