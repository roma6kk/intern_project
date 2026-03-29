'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Search, Loader2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/shared/api';
import type { Post } from '@/entities/post';
import { PostCard } from '@/widgets/post-card';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Row from GET /profiles/search (core include user + account.username). */
interface ProfileSearchHit {
  id: string;
  userId: string;
  firstName: string;
  secondName?: string;
  avatarUrl?: string;
  user?: {
    id: string;
    account?: { username: string };
  };
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<ProfileSearchHit[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setPosts([]);
      setProfiles([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      const q = query.trim();
      try {
        const [postsRes, profilesRes] = await Promise.all([
          api.get('/posts/search', { params: { search: q, limit: 20 } }),
          api.get<ProfileSearchHit[]>(`/profiles/search?query=${encodeURIComponent(q)}`),
        ]);
        const rawPosts = postsRes.data.data || [];
        const normalizedPosts = rawPosts.map((p: Post) => {
          const author = p.author || { id: p.authorId };
          const username =
            author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
          const profile = author.profile || {};

          return {
            ...p,
            author: { ...author, id: author.id || p.authorId, username, profile },
          };
        });
        setPosts(normalizedPosts);
        setProfiles(Array.isArray(profilesRes.data) ? profilesRes.data : []);
      } catch (error) {
        console.error('Search error:', error);
        setPosts([]);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  const profilesLinkable = profiles.filter((p) => p.user?.account?.username);

  return (
    <div className={modal.root}>
      <button type="button" className={modal.dim} onClick={onClose} aria-label="Закрыть" />
      <div className={cn(modal.shell, 'max-w-2xl max-h-[80vh]')}>
        <div className={modal.header}>
          <h2 className="text-lg font-semibold text-foreground">Поиск</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Посты и пользователи..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
            </div>
          </form>
        </div>

        <div className="overflow-y-auto max-h-96 min-h-0">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-5 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-foreground">Поиск...</span>
              </div>
            </div>
          )}

          {!loading && query && posts.length === 0 && profilesLinkable.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Ничего не найдено</p>
              <p className="text-sm text-muted-foreground mt-1">Попробуйте другой запрос</p>
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Введите запрос для поиска</p>
              <p className="text-sm text-muted-foreground mt-1">Нажмите Enter для перехода к полному поиску</p>
            </div>
          )}

          {profilesLinkable.length > 0 && (
            <div className="px-4 pt-2 pb-1 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Пользователи
              </p>
              <ul className="space-y-1">
                {profilesLinkable.map((profile) => {
                    const username = profile.user!.account!.username;
                    const displayName = [profile.firstName, profile.secondName]
                      .filter(Boolean)
                      .join(' ')
                      .trim();
                    return (
                      <li key={profile.id}>
                        <Link
                          href={`/profile/${encodeURIComponent(username)}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/80 transition-colors"
                        >
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                            {profile.avatarUrl ? (
                              <Image
                                src={profile.avatarUrl}
                                alt=""
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="flex w-full h-full items-center justify-center text-muted-foreground">
                                <User className="w-5 h-5" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">@{username}</p>
                            {displayName ? (
                              <p className="text-xs text-muted-foreground truncate">{displayName}</p>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          <div className="space-y-4 p-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}