'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  deletedAt?: string | null;
  account?: {
    email: string;
    username: string;
    phoneNumber?: string;
  };
  profile?: {
    id: string;
    userId: string;
    firstName: string;
    secondName: string;
    avatarUrl?: string;
    bio?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/users/me');
      const normalized = {
        ...data,
        username: data.username || data.account?.username || data.profile?.firstName || '',
      };
      setUser(normalized);
      localStorage.setItem('user', JSON.stringify(normalized));
      setIsLoading(false);
    } catch {
      const token = Cookies.get('accessToken');
      if (!token) {
        setUser(null);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
      Cookies.remove('accessToken');
      try {
        await api.post('/auth/logout');
      } catch {
      }
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const cachedRaw = localStorage.getItem('user');
      const cached = cachedRaw ? JSON.parse(cachedRaw) : null;
      const token = Cookies.get('accessToken');

      if (token) {
        await checkAuth();
      } else if (cached) {
        setUser(cached);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [checkAuth]);

  const login = (token: string, userData?: User) => {
    Cookies.set('accessToken', token);
    if (!userData) {
      setIsLoading(false);
      window.location.href = '/feed';
      return;
    }

    const normalized = {
      ...userData,
      username:
        userData.username ||
        userData.account?.username ||
        userData.profile?.firstName ||
        '',
    };
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    setIsLoading(false);
    window.location.href = '/feed';
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    Cookies.remove('accessToken');
    setUser(null);
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/users/me');
      const normalized = {
        ...data,
        username: data.username || data.account?.username || data.profile?.firstName || '',
      };
      setUser(normalized);
      localStorage.setItem('user', JSON.stringify(normalized));
    } catch {
      Cookies.remove('accessToken');
      setUser(null);
      localStorage.removeItem('user');
      router.replace('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};