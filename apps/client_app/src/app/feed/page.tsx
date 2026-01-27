'use client';

import { useAuth } from '@/context.tsx/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';

export default function FeedPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      api.get('/posts').then((res) => setPosts(res.data.data));
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Welcome, {user.username}</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </header>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="border p-4 rounded bg-white shadow">
            <p className="mb-2 font-bold">{post.author.profile.firstName}</p>
            {post.assets?.[0] && (
              <img src={post.assets[0].url} alt="Post" className="w-full h-64 object-cover rounded mb-2" />
            )}
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}