'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PostCard } from '@/widgets/post-card';
import type { Post } from '@/entities/post';
import api from '@/shared/api';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await api.get<Post>(`/posts/${params.id}`);
        const author = res.data.author || { id: res.data.authorId };
        const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
        const profile = author.profile || {};
        
        setPost({ 
            ...res.data, 
            author: { ...author, id: author.id || res.data.authorId, username, profile } 
        });
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
      <div className="min-h-screen bg-muted/50 flex items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground font-medium">Загрузка поста...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-muted/50 flex justify-center py-6">
      <div className="w-full max-w-2xl px-4">
        <PostCard post={post} fullView={true} />
      </div>
    </div>
  );
}