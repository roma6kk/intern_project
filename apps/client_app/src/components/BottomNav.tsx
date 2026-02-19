'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import CreatePostModal from './CreatePostModal';

export default function BottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-3xl mx-auto flex items-center p-2">
          <Link href="/feed" className="flex-1 flex justify-center py-2 text-gray-600"><Home /></Link>
          <Link href="/search" className="flex-1 flex justify-center py-2 text-gray-600"><Search /></Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex justify-center py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <PlusSquare />
          </button>
          <Link href="/interactions" className="flex-1 flex justify-center py-2 text-gray-600"><Heart /></Link>
          <Link href="/profile" className="flex-1 flex justify-center py-2 text-gray-600"><User /></Link>
        </div>
      </nav>
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
