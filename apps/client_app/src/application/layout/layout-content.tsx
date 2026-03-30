'use client';

import { useAuth } from '@/entities/session';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/cn';
import { TopNav } from '@/widgets/top-nav';
import { BottomNav } from '@/widgets/bottom-nav';
import { RecoveryBanner } from '@/widgets/recovery-banner';
import { SuspendedBanner } from '@/widgets/suspended-banner';

function isActiveSuspension(user: {
  accountState?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  suspendedUntil?: string | null;
}): boolean {
  if (user.accountState !== 'SUSPENDED') return false;
  if (!user.suspendedUntil) return true;
  return new Date(user.suspendedUntil) > new Date();
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isAuthPage = pathname?.startsWith('/login');
  const isChatPage = pathname?.startsWith('/chat');
  const isDeleted = user?.deletedAt && !isAuthPage;
  const isSuspended = !isAuthPage && user != null && isActiveSuspension(user);

  if (isAuthPage) {
    return <main className="min-h-screen bg-transparent text-foreground">{children}</main>;
  }

  if (!isLoading && isDeleted) {
    return <RecoveryBanner />;
  }

  if (!isLoading && isSuspended) {
    return <SuspendedBanner />;
  }

  return (
    <div className="rika-shell min-h-screen flex flex-col bg-transparent text-foreground">
      <TopNav />
      <main
        className={cn(
          'flex-1 w-full min-h-0 relative',
          isChatPage
            ? 'flex flex-col pb-0'
            : 'max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pb-24 md:pb-8 pt-4 sm:pt-6'
        )}
      >
        {children}
      </main>
      {!isChatPage && <BottomNav />}
    </div>
  );
}
