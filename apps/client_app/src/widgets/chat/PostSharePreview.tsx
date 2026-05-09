'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EyeOff } from 'lucide-react';
import api from '@/shared/api';
import type { Post } from '@/entities/post';
import { isVideoUrl } from '@/shared/lib/is-video-url';
import { StoryVideoThumb } from '@/features/stories/ui/story-video-thumb';

type PreviewState =
  | { kind: 'loading'; postId: string }
  | { kind: 'ready'; postId: string; post: Post }
  | { kind: 'error'; postId: string };

function getFirstMedia(post: Post): { url: string; isVideo: boolean } | null {
  const a = post.assets?.[0];
  if (a?.url) {
    const typedVideo = (a.type ?? '').toUpperCase() === 'VIDEO';
    return { url: a.url, isVideo: typedVideo || isVideoUrl(a.url) };
  }
  const f = post.files?.[0];
  if (f?.url) return { url: f.url, isVideo: isVideoUrl(f.url) };
  const m = post.media?.[0];
  if (m?.url) return { url: m.url, isVideo: isVideoUrl(m.url) };
  return null;
}

function getAuthorLabel(post: Post): string {
  const a = post.author;
  return (
    a?.username ||
    a?.account?.username ||
    a?.profile?.firstName ||
    (post.authorId ? post.authorId.slice(0, 8) : 'User')
  );
}

function getDescriptionSnippet(post: Post, maxLen: number): string {
  const t = (post.description ?? '').trim();
  if (!t) return '';
  return t.length > maxLen ? t.slice(0, maxLen).trimEnd() + '…' : t;
}

export default function PostSharePreview({ postId }: { postId: string }) {
  const href = `/post/${postId}`;
  const [state, setState] = useState<PreviewState>({ kind: 'loading', postId });

  useEffect(() => {
    let active = true;
    api
      .get<Post>(`/posts/${postId}`)
      .then((res) => {
        if (!active) return;
        setState({ kind: 'ready', postId, post: res.data });
      })
      .catch(() => {
        if (!active) return;
        setState({ kind: 'error', postId });
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const view = useMemo(() => {
    if (state.kind !== 'ready' || state.postId !== postId) return null;
    const post = state.post;
    const media = getFirstMedia(post);
    const author = getAuthorLabel(post);
    const desc = getDescriptionSnippet(post, 120);
    const hasText = Boolean(desc);
    return { media, author, desc, hasText };
  }, [state, postId]);

  if (state.postId !== postId) return null;

  if (state.kind === 'loading') {
    return (
      <Link
        href={href}
        className="mt-1 block w-[260px] max-w-full overflow-hidden rounded-xl border border-border/70 bg-muted/30 hover:bg-muted/40 transition-colors"
        aria-label="Открыть пост"
      >
        <div className="h-[120px] w-full bg-muted/40" />
      </Link>
    );
  }

  if (state.kind === 'error' || !view) {
    return (
      <div
        className="mt-1 w-[260px] max-w-full overflow-hidden rounded-xl border border-border/70 bg-muted/25"
        role="note"
        aria-label="Пост недоступен"
      >
        <div className="h-[70px] w-full flex items-center gap-2 px-3 text-muted-foreground">
          <EyeOff size={16} />
          <span className="text-sm font-medium">Пост недоступен</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="mt-1 block w-[260px] max-w-full overflow-hidden rounded-xl border border-border/70 bg-card/80 hover:bg-muted/30 transition-colors"
      aria-label="Открыть пост"
    >
      {view.media ? (
        <div className="relative h-[140px] w-full bg-muted">
          {view.media.isVideo ? (
            <StoryVideoThumb src={view.media.url} />
          ) : (
            <Image
              src={view.media.url}
              alt=""
              fill
              className="object-cover"
              sizes="260px"
              priority={false}
            />
          )}
        </div>
      ) : (
        <div className="h-[10px]" />
      )}
      <div className="px-3 py-2">
        <div className="text-xs font-semibold text-muted-foreground truncate">{view.author}</div>
        {view.hasText && (
          <div className="mt-1 text-sm text-foreground leading-snug line-clamp-3">
            {view.desc}
          </div>
        )}
      </div>
    </Link>
  );
}

