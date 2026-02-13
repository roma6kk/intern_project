'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MessageSquare, PlusSquare, Heart, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CreatePostModal from './CreatePostModal';
import SearchModal from './SearchModal';

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Link href="/feed" className="text-2xl font-bold text-gray-700">Innogram</Link>
          </div>

          <div className="flex-1 px-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                placeholder="Search" 
                className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 cursor-pointer text-gray-500" 
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              title="Поиск"
            >
              <Search />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="hidden md:block cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              title="Создать пост"
            >
              <PlusSquare />
            </button>
            <MessageSquare className="cursor-pointer text-gray-600" />
            <Heart className="cursor-pointer text-gray-600" />
            <button onClick={() => router.push('/profile/me')} className="w-8 h-8 rounded-full overflow-hidden">
              <Image src={user?.profile?.avatarUrl || '/default-avatar.svg'} alt="me" width={32} height={32} className="w-full h-full object-cover" />
            </button>
            <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Выйти">
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
