'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Loader2, RotateCcw } from 'lucide-react';

export default function RecoveryBanner() {
  const { user, refreshUser } = useAuth();
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletedAt = user?.deletedAt ? new Date(user.deletedAt) : null;
  const recoverBy = deletedAt
    ? new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-100 rounded-full">
          <RotateCcw className="w-6 h-6 text-amber-600" />
        </div>
        <h1 className="text-xl font-semibold text-center text-gray-900">
          Account scheduled for deletion
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Your account is scheduled for permanent deletion. You can recover it within 30 days.
          {daysLeft > 0 && (
            <span className="block mt-2 font-medium text-amber-700">
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left to recover.
            </span>
          )}
        </p>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        <button
          onClick={handleRecover}
          disabled={recovering || daysLeft <= 0}
          className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <p className="text-xs text-gray-500 text-center">
            The recovery window has expired. Your account will be permanently deleted.
          </p>
        )}
      </div>
    </div>
  );
}
