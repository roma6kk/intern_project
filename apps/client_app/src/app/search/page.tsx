'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, LogIn } from 'lucide-react';
import api from '@/lib/api';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';

interface SearchParams {
  page: number;
  limit: number;
  sort: string;
  search?: string;
  mediaOnly?: boolean;
  followingOnly?: boolean;
}

function SearchPageContent() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [filter, setFilter] = useState<'all' | 'following' | 'withImages'>('all');
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && user) {
      api.get('/follows/following/me')
        .then((res) => {
          const raw: { following?: { id?: string } }[] = res.data || [];
          const ids = raw
            .map((f: { following?: { id?: string } }) => f.following?.id)
            .filter((id): id is string => Boolean(id));
          setFollowingIds(ids);
        })
        .catch(() => {
          setFollowingIds([]);
        });
    }
  }, [user, isLoading]);

  const searchPosts = useCallback(async (searchQuery: string, pageNum: number = 1, append: boolean = false) => {
    const hasQuery = Boolean(searchQuery.trim());

    setLoading(true);
    try {
      let response;
      const params: SearchParams = { page: pageNum, limit: 10, sort };
      
      if (sort === 'popular') params.sort = 'trending';
      
      if (filter === 'withImages') params.mediaOnly = true;
      if (filter === 'following') params.followingOnly = true;
      
      if (hasQuery) {
        params.search = searchQuery;
        response = await api.get('/posts/search', { params });
      } else {
        response = await api.get('/posts', { params });
      }
      
      const newPosts = response.data.data || [];
      const meta = response.data.meta || {};
      
      if (append) {
        setPosts(prev => {
          const combined = [...prev, ...newPosts];
          const seen = new Set<string>();
          return combined.filter((p: Post) => {
            const id = p.id || '';
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        });
      } else {
        const seen = new Set<string>();
        const unique = newPosts.filter((p: Post) => {
          const id = p.id || '';
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setPosts(unique);
      }
      
      setHasMore(newPosts.length === 10 && meta.total > pageNum * 10);
    } catch {
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [sort, filter]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      searchPosts(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, sort, filter, searchPosts]);

  useEffect(() => {
    setPage(1);
    const timeoutId = setTimeout(() => {
      searchPosts(query);
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [query, sort, filter, searchPosts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchPosts(query, nextPage, true);
    }
  };

  const normalizedPosts = useMemo(() => {
    const mapped = posts.map((p: Post) => {
      const author = p.author || { id: p.authorId };
      const username =
        author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
      const profile = author.profile || {};
      return { ...p, author: { ...author, id: author.id || p.authorId, username, profile } };
    });

    let filtered = mapped;
    if (filter === 'withImages') {
      const hasImages = (p: Post) => {
        const items = [
          ...(p.files || []),
          ...(p.media || []),
          ...(p.assets || [])
        ];
        return items.some(f => {
          if (!f) return false;
          if (f.type && String(f.type).startsWith('image')) return true;
          if (f.url && /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i.test(f.url)) return true;
          return false;
        });
      };

      filtered = filtered.filter(hasImages);
    }
    if (filter === 'following') {
      filtered = filtered.filter(p => p.author?.id && followingIds.includes(p.author.id));
    }

    const sortFn = (a: Post, b: Post) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (sort === 'newest') return tb - ta;
      if (sort === 'oldest') return ta - tb;
      if (sort === 'popular') {
        const la = (a.likesCount || a.likes || 0) as number;
        const lb = (b.likesCount || b.likes || 0) as number;
        return lb - la;
      }
      return 0;
    };

    filtered.sort(sortFn);
    return filtered;
  }, [posts, filter, sort, followingIds]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="text-gray-600 font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium text-center">Войдите для поиска постов</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск постов..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-500"
              autoFocus
            />
          </div>
          <div className="mt-3 flex gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest' | 'popular')}
              className="flex-1 border rounded-lg py-2 px-3 text-sm focus:outline-none text-gray-500" 
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">По популярности</option>
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'following' | 'withImages')}
              className="flex-1 border rounded-lg py-2 px-3 text-sm focus:outline-none text-gray-500"
            >
              <option value="all">Все</option>
              <option value="following">От подписок</option>
              <option value="withImages">С изображениями</option>
            </select>
          </div>
        </div>

        {loading && page === 1 && (
          <div className="flex justify-center py-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4 flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="text-sm text-gray-600">Поиск постов...</span>
            </div>
          </div>
        )}
        
        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{query ? 'Посты не найдены' : 'Постов нет'}</h3>
            <p className="text-sm text-gray-500">{query ? 'Попробуйте изменить поисковый запрос' : 'Пока нет доступных постов'}</p>
          </div>
        )}

        <div className="space-y-6">
          {normalizedPosts.map((post, index) => {
            const isLast = index === normalizedPosts.length - 1;
            return (
              <div
                key={post.id}
                ref={isLast && hasMore ? (el: HTMLDivElement | null) => {
                  if (el && !loading) {
                    const observer = new IntersectionObserver(
                      ([entry]) => {
                        if (entry.isIntersecting) {
                          loadMore();
                          observer.disconnect();
                        }
                      },
                      { threshold: 0.1 }
                    );
                    observer.observe(el);
                  }
                } : null}
              >
                <PostCard post={post} />
              </div>
            );
          })}
        </div>

        {loading && page > 1 && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Загрузка...</span>
            </div>
          </div>
        )}
        
        {!hasMore && normalizedPosts.length > 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">Вы просмотрели все результаты</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            <p className="text-gray-600 font-medium">Загрузка...</p>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}