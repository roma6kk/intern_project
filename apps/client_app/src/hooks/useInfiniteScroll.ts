'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';

interface UseInfiniteScrollOptions {
  endpoint: string;
  limit?: number;
  maxItems?: number;
}

interface PaginationResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useInfiniteScroll<T>({ 
  endpoint, 
  limit = 10, 
  maxItems = 50 
}: UseInfiniteScrollOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await api.get<PaginationResponse<T>>(
        `${endpoint}?page=${page}&limit=${limit}`
      );
      
      const newItems = response.data.data || [];
      const meta = response.data.meta;

      setItems(prev => {
        const itemsMap = new Map();
        
        prev.forEach(item => {
          const id = (item as any)?.id;
          if (id) itemsMap.set(id, item);
        });
        
        newItems.forEach(item => {
          const id = (item as any)?.id;
          if (id) itemsMap.set(id, item);
        });
        
        const combined = Array.from(itemsMap.values());
        
        if (combined.length > maxItems) {
          return combined.slice(-maxItems);
        }
        return combined;
      });

      setHasMore(page < meta.totalPages);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, maxItems, page, loading, hasMore]);

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const refresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (page === 1 && items.length === 0) {
      loadMore();
    }
  }, [loadMore, page, items.length]);

  return {
    items,
    loading,
    hasMore,
    lastElementRef,
    refresh
  };
}