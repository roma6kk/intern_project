'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import api from '@/lib/api';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';

export default function SearchPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isLoading && user) {
      api.get('/follows/following/me')
        .then(() => {
        })
        .catch(() => {
        });
    }
  }, [user, isLoading]);

  const searchPosts = async (searchQuery: string, pageNum: number = 1, append: boolean = false) => {
    if (!searchQuery.trim()) {
      setPosts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/posts/search', {
        params: { search: searchQuery, page: pageNum, limit: 10 }
      });
      
      const newPosts = response.data.data || [];
      const meta = response.data.meta || {};
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(newPosts.length === 10 && meta.total > pageNum * 10);
    } catch {
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      searchPosts(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchPosts(query, nextPage, true);
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

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!isLoading && !user) return <div className="p-4">Please sign in</div>;

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
        </div>

        {loading && page === 1 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!loading && query && posts.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Посты не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
        
        {!query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Поиск постов</h3>
            <p className="text-gray-500">Введите запрос для поиска интересных постов</p>
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
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!hasMore && normalizedPosts.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            Вы просмотрели все результаты
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
}