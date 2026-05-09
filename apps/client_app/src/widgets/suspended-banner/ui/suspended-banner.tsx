'use client';

import { useAuth } from '@/entities/session';
import { AlertTriangle, LogOut } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';

export function SuspendedBanner() {
  const { user, logout } = useAuth();

  const until = user?.suspendedUntil ? new Date(user.suspendedUntil) : null;
  const isTemporary = Boolean(
    until &&
      until.getTime() >
        // eslint-disable-next-line react-hooks/purity -- compare suspension end to current time
        Date.now()
  );
  const formattedUntil =
    until && isTemporary
      ? until.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={cn(surface.card, surface.elevated, 'max-w-md w-full p-6 space-y-4')}>
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-warning-muted rounded-full">
          <AlertTriangle className="w-6 h-6 text-warning" />
        </div>
        <h1 className="text-xl font-semibold text-center text-foreground">Account suspended</h1>
        <p className="text-sm text-muted-foreground text-center">
          Your account access is temporarily restricted. You cannot use the app until the suspension is lifted.
          {formattedUntil && (
            <span className="block mt-2 font-medium text-warning">Expected end: {formattedUntil}</span>
          )}
          {!formattedUntil && (
            <span className="block mt-2 text-muted-foreground">If you believe this is a mistake, contact support.</span>
          )}
        </p>
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full py-3 px-4 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 flex items-center justify-center gap-2 border border-border"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
