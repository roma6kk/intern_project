'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';
import api from '@/lib/api';
import Cookies from 'js-cookie';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        console.log('Fetching post:', `/posts/${params.id}`);
        console.log('Access token:', Cookies.get('accessToken'));
        const res = await api.get<Post>(`/posts/${params.id}`);
        const author = res.data.author || { id: res.data.authorId };
        const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
        const profile = author.profile || {};
        setPost({ ...res.data, author: { ...author, id: author.id || res.data.authorId, username, profile } });
      } catch (error) {
        console.error('Error loading post:', error);
        router.push('/feed');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <PostCard post={post} />
      </div>
    </div>
  );
}
