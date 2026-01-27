'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context.tsx/AuthContext';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      Cookies.set('accessToken', accessToken);
      
      api.get('/users/me')
        .then((res) => {
          login(accessToken, res.data); 
          router.push('/feed');
        })
        .catch((err) => {
          console.error('Failed to fetch user data', err);
          router.push('/login');
        });
    } else {
      router.push('/login');
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Authorizing...</div>
    </div>
  );
}