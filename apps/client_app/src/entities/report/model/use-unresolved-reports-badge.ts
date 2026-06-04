'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { hasUnresolvedReports } from '../api/reports-api';
import { isReportQueueNotification } from '@/shared/lib/moderation-notification';

async function fetchHasUnresolved(): Promise<boolean> {
  try {
    return await hasUnresolvedReports();
  } catch {
    return false;
  }
}

export function useUnresolvedReportsBadge(enabled: boolean) {
  const pathname = usePathname() ?? '';
  const [hasUnresolved, setHasUnresolved] = useState(false);

  const sync = useCallback(async () => {
    if (!enabled) {
      setHasUnresolved(false);
      return;
    }
    setHasUnresolved(await fetchHasUnresolved());
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      const value = await fetchHasUnresolved();
      if (!cancelled) {
        setHasUnresolved(value);
      }
    };

    void load();

    const handleFocus = () => {
      void load();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void load();
      }
    };

    const interval = setInterval(() => {
      void load();
    }, 30000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, pathname]);

  const onSocketNotification = useCallback(
    (notification: { type: string; message?: string }) => {
      if (!enabled) return;
      if (isReportQueueNotification(notification)) {
        setHasUnresolved(true);
        void sync();
      }
    },
    [enabled, sync],
  );

  return {
    showBadge: enabled && hasUnresolved && !pathname.startsWith('/moderation'),
    refresh: sync,
    onSocketNotification,
  };
}
