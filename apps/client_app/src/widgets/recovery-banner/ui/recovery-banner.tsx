'use client';

import { useState } from 'react';
import { useAuth } from '@/entities/session';
import api from '@/shared/api';
import { Loader2, RotateCcw } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';

export function RecoveryBanner() {
  const { user, refreshUser } = useAuth();
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletedAt = user?.deletedAt ? new Date(user.deletedAt) : null;
  const recoverBy = deletedAt ? new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const daysLeft = recoverBy
    ? Math.max(0, Math.ceil((recoverBy.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  const handleRecover = async () => {
    try {
      setRecovering(true);
      setError(null);
      await api.post('/users/me/recover');
      await refreshUser();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Recovery failed. The 30-day window may have expired.');
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={cn(surface.card, surface.elevated, 'max-w-md w-full p-6 space-y-4')}>
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-warning-muted rounded-full">
          <RotateCcw className="w-6 h-6 text-warning" />
        </div>
        <h1 className="text-xl font-semibold text-center text-foreground">Account scheduled for deletion</h1>
        <p className="text-sm text-muted-foreground text-center">
          Your account is scheduled for permanent deletion. You can recover it within 30 days.
          {daysLeft > 0 && (
            <span className="block mt-2 font-medium text-warning">{daysLeft} day{daysLeft !== 1 ? 's' : ''} left to recover.</span>
          )}
        </p>
        {error && (
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleRecover}
          disabled={recovering || daysLeft <= 0}
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {recovering ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Recovering...
            </>
          ) : (
            'Recover account'
          )}
        </button>
        {daysLeft <= 0 && (
          <p className="text-xs text-muted-foreground text-center">
            The recovery window has expired. Your account will be permanently deleted.
          </p>
        )}
      </div>
    </div>
  );
}
