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
    cursor: string | null;
    hasNextPage: boolean;
    limit: number;
    total?: number;
  };
}

export function useInfiniteScroll<T extends { id?: string }>({
  endpoint,
  limit = 10,
  maxItems = 50,
}: UseInfiniteScrollOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', String(limit));
      if (cursor) {
        params.set('cursor', cursor);
      }

      const response = await api.get<PaginationResponse<T>>(
        `${endpoint}?${params.toString()}`,
      );

      const newItems = response.data.data || [];
      const meta = response.data.meta;

      setItems((prev) => {
        const itemsMap = new Map<string, T>();

        prev.forEach((item) => {
          const id = item.id;
          if (id) itemsMap.set(id, item);
        });

        newItems.forEach((item) => {
          const id = item.id;
          if (id) itemsMap.set(id, item);
        });

        const combined = Array.from(itemsMap.values());

        if (combined.length > maxItems) {
          return combined.slice(-maxItems);
        }
        return combined;
      });

      setHasMore(Boolean(meta.hasNextPage));
      setCursor(meta.cursor ?? null);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, maxItems, cursor, loading, hasMore]);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore],
  );

  const refresh = useCallback(() => {
    setItems([]);
    setCursor(null);
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
    if (items.length === 0) {
      loadMore();
    }
  }, [loadMore, items.length]);

  return {
    items,
    loading,
    hasMore,
    lastElementRef,
    refresh
  };
}