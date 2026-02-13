'use client';

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Post } from '@/types';
import PostCard from './PostCard';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
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
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get('/posts/search', {
          params: { search: query, limit: 20 }
        });
        const rawPosts = response.data.data || [];
        const normalizedPosts = rawPosts.map((p: Post) => {
          const author = p.author || { id: p.authorId };
          const username =
            author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
          const profile = author.profile || {};
          
          return { 
            ...p, 
            author: { ...author, id: author.id || p.authorId, username, profile }
          };
        });
        setPosts(normalizedPosts);
      } catch (error) {
        console.error('Search error:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-600">Поиск</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск постов..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                autoFocus
              />
            </div>
          </form>
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {!loading && query && posts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Посты не найдены
            </div>
          )}
          
          {!loading && !query && (
            <div className="text-center py-8 text-gray-500">
              <p>Введите запрос для поиска</p>
              <p className="text-sm mt-2">Нажмите Enter для перехода к полному поиску</p>
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