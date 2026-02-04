'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      console.log('[AuthCallback] Setting accessToken and redirecting to /feed');
      Cookies.set('accessToken', accessToken);
      // Force AuthProvider to re-check auth by clearing the init flag
      sessionStorage.removeItem('auth_initialized');
      router.replace('/feed');
    } else {
      console.log('[AuthCallback] No accessToken, redirecting to /login');
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Authorizing...</div>
    </div>
  );
}