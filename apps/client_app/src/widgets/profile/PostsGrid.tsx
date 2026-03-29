'use client';

import Image from 'next/image';
import { Heart, MessageCircle, Grid, Play } from 'lucide-react';

interface Asset {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface Post {
  id: string;
  description: string;
  assets: Asset[];
  _count: {
    likes: number;
    comments: number;
  };
}

interface PostsGridProps {
  posts: Post[];
  router: {
    push: (path: string) => void;
  };
}

const isVideoAsset = (asset?: Asset) => {
  if (!asset?.url) return false;
  if (asset.type === 'VIDEO') return true;
  return /\.(mp4|webm|ogg|mov)$/i.test(asset.url);
};

export default function PostsGrid({ posts, router }: PostsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => {
        const firstAsset = post.assets?.[0];
        const isVideo = isVideoAsset(firstAsset);
        const hasMultipleAssets = post.assets && post.assets.length > 1;

        return (
          <div
            key={post.id}
            className="group relative overflow-hidden bg-muted aspect-square cursor-pointer"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            {firstAsset ? (
              isVideo ? (
                <video
                  key={firstAsset.url}
                  src={firstAsset.url}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                  onLoadedData={(e) => {
                    const v = e.currentTarget;
                    v.pause();
                    try {
                      v.currentTime = 0;
                    } catch {
                    }
                  }}
                  onError={(e) => {
                    const v = e.currentTarget;
                    v.style.display = 'none';
                  }}
                />
              ) : (
                <Image
                  src={firstAsset.url}
                  alt={post.description || 'Post image'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  unoptimized
                  onError={() => {
                  }}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Grid className="w-8 h-8 text-muted-foreground" />
              </div>
            )}

            {isVideo && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 rounded-full p-1.5">
                <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
              </div>
            )}

            {hasMultipleAssets && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1.5">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                  <path d="M1 6a1 1 0 011-1h1v2H2v8h8v1a1 1 0 01-1 1H2a1 1 0 01-1-1V6z" />
                </svg>
              </div>
            )}

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-1 text-white font-semibold text-sm md:text-base">
                <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                <span>
                  {post._count?.likes > 1000
                    ? `${(post._count.likes / 1000).toFixed(1)}K`
                    : post._count?.likes || 0}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white font-semibold text-sm md:text-base">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span>
                  {post._count?.comments > 1000
                    ? `${(post._count.comments / 1000).toFixed(1)}K`
                    : post._count?.comments || 0}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
