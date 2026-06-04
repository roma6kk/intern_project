'use client';

import Image from 'next/image';
import type { Post } from '@/entities/post';

export default function PostGridItem({ post, onClick }: { post: Post; onClick?: () => void }) {
  return (
    <div className="relative w-full aspect-square overflow-hidden cursor-pointer" onClick={onClick}>
      {post.assets?.[0] ? (
        <Image src={post.assets[0].url} alt="grid" width={300} height={300} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-muted" />
      )}

      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center text-white opacity-0 hover:opacity-100">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-6-4.35-9-7.5C1.5 11.5 3 5.5 7 4c2-.75 5 1 5 1s3-1.75 5-1c4 1.5 5.5 7.5 4 9.5-3 3.15-9 7.5-9 7.5z"/></svg>
            <span className="text-sm">{post.likesCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span className="text-sm">{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
