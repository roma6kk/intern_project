'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/shared/api';
import type { Post } from '@/entities/post';

type PreviewState =
  | { kind: 'loading' }
  | { kind: 'ready'; post: Post }
  | { kind: 'error' };

function getFirstAssetUrl(post: Post): string | null {
  const a = post.assets?.[0];
  if (a?.url) return a.url;
  const f = post.files?.[0];
  if (f?.url) return f.url;
  const m = post.media?.[0];
  if (m?.url) return m.url;
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
  const [state, setState] = useState<PreviewState>({ kind: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ kind: 'loading' });
    api
      .get<Post>(`/posts/${postId}`)
      .then((res) => {
        if (!active) return;
        setState({ kind: 'ready', post: res.data });
      })
      .catch(() => {
        if (!active) return;
        setState({ kind: 'error' });
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const view = useMemo(() => {
    if (state.kind !== 'ready') return null;
    const post = state.post;
    const mediaUrl = getFirstAssetUrl(post);
    const author = getAuthorLabel(post);
    const desc = getDescriptionSnippet(post, 120);
    const hasText = Boolean(desc);
    return { mediaUrl, author, desc, hasText };
  }, [state]);

  // Always clickable; when loading/error, show empty placeholder (no text).
  if (state.kind === 'loading' || state.kind === 'error' || !view) {
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

  return (
    <Link
      href={href}
      className="mt-1 block w-[260px] max-w-full overflow-hidden rounded-xl border border-border/70 bg-card/80 hover:bg-muted/30 transition-colors"
      aria-label="Открыть пост"
    >
      {view.mediaUrl ? (
        <div className="relative h-[140px] w-full bg-muted">
          <Image
            src={view.mediaUrl}
            alt=""
            fill
            className="object-cover"
            sizes="260px"
            priority={false}
          />
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

