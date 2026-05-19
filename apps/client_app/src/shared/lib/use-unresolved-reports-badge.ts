'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { hasUnresolvedReports } from '@/entities/report';
import { isReportQueueNotification } from '@/shared/lib/moderation-notification';

export function useUnresolvedReportsBadge(enabled: boolean) {
  const pathname = usePathname() ?? '';
  const [hasUnresolved, setHasUnresolved] = useState(false);

  const sync = useCallback(async () => {
    if (!enabled) {
      setHasUnresolved(false);
      return;
    }
    try {
      setHasUnresolved(await hasUnresolvedReports());
    } catch {
      setHasUnresolved(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setHasUnresolved(false);
      return;
    }

    void sync();

    const handleFocus = () => {
      void sync();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void sync();
      }
    };

    const interval = setInterval(() => {
      void sync();
    }, 30000);

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, pathname, sync]);

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
    showBadge: hasUnresolved && !pathname.startsWith('/moderation'),
    refresh: sync,
    onSocketNotification,
  };
}
