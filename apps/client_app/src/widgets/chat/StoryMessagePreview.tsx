'use client';

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import api from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';
import type { StoriesFeedGroup } from '@/features/stories/model/types';
import { StoryViewerModal } from '@/features/stories/ui/story-viewer-modal';
import { isProbablyVideoUrl, StoryVideoThumb } from '@/features/stories/ui/story-video-thumb';
import { useAuth } from '@/entities/session';

type Kind = 'reaction' | 'reply';

export type StoryMeta = {
  kind: Kind;
  storyId: string;
  emoji?: string;
  assetUrl?: string;
  /** From chat ref (`assetType=VIDEO`); older messages may omit it. */
  assetType?: string;
  text?: string; // optional extra text for reply
};

export function parseStoryMeta(rawContent: string | null | undefined): StoryMeta | null {
  const raw = (rawContent ?? '').trim();
  if (!raw) return null;

  const lines = raw.split('\n');
  const first = lines[0]?.trim() ?? '';

  const parseKV = (s: string) => {
    const out: Record<string, string> = {};
    for (const part of s.split(' ')) {
      const idx = part.indexOf('=');
      if (idx <= 0) continue;
      const k = part.slice(0, idx);
      const v = part.slice(idx + 1);
      if (k && v) out[k] = v;
    }
    return out;
  };

  if (first.startsWith('[story-reaction]')) {
    const kv = parseKV(first.replace('[story-reaction]', '').trim());
    if (!kv.storyId) return null;
    return {
      kind: 'reaction',
      storyId: kv.storyId,
      emoji: kv.emoji,
      assetUrl: kv.assetUrl,
      assetType: kv.assetType,
    };
  }

  if (first.startsWith('[story-reply]')) {
    const kv = parseKV(first.replace('[story-reply]', '').trim());
    if (!kv.storyId) return null;
    const restText = lines.slice(1).join('\n').trim();
    return {
      kind: 'reply',
      storyId: kv.storyId,
      assetUrl: kv.assetUrl,
      assetType: kv.assetType,
      text: restText || undefined,
    };
  }

  return null;
}

export default function StoryMessagePreview({
  meta,
  isOwn,
}: {
  meta: StoryMeta;
  isOwn: boolean;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState<StoriesFeedGroup[] | null>(null);

  const title = meta.kind === 'reaction' ? 'Story reaction' : 'Reply to story';
  const subtitle = meta.kind === 'reaction' ? (meta.emoji ? `Reaction: ${meta.emoji}` : 'Reaction') : 'Tap to view';

  const thumb = meta.assetUrl || '';
  const thumbIsVideo =
    meta.assetType === 'VIDEO' || (thumb ? isProbablyVideoUrl(thumb) : false);

  const openStory = useCallback(async () => {
    setOpen(true);
    if (group) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/stories/${meta.storyId}`);
      const author = data?.author;
      const g: StoriesFeedGroup = {
        author: {
          id: author?.id ?? 'unknown',
          username:
            author?.account?.username ??
            author?.username ??
            author?.profile?.firstName ??
            'Unknown',
          profile: {
            avatarUrl: author?.profile?.avatarUrl ?? null,
            isPrivate: author?.profile?.isPrivate ?? false,
          },
        },
        stories: [
          {
            id: data.id,
            createdAt: data.createdAt,
            expiresAt: data.expiresAt,
            caption: data.caption ?? null,
            assets: data.assets ?? [],
            seen: true,
          },
        ],
        hasUnseen: false,
      };
      setGroup([g]);
    } catch {
      setGroup([]);
    } finally {
      setLoading(false);
    }
  }, [meta.storyId, group]);

  return (
    <>
      <button
        type="button"
        onClick={() => void openStory()}
        className={cn(
          'w-full text-left rounded-2xl border p-2.5 transition-colors',
          isOwn
            ? 'border-white/25 bg-white/10 hover:bg-white/15'
            : 'border-border/70 bg-muted/30 hover:bg-muted/45',
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border/70 shrink-0 flex items-center justify-center">
            {thumb ? (
              thumbIsVideo ? (
                <StoryVideoThumb src={thumb} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )
            ) : (
              <Image src="/default-avatar.svg" alt="" width={48} height={48} className="opacity-70" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className={cn('text-xs font-semibold', isOwn ? 'text-blue-100' : 'text-muted-foreground')}>
              {title}
            </div>
            <div className={cn('text-sm font-semibold truncate', isOwn ? 'text-white' : 'text-foreground')}>
              {subtitle}
            </div>
            {meta.kind === 'reply' && meta.text && (
              <div className={cn('text-xs truncate', isOwn ? 'text-blue-100/90' : 'text-muted-foreground')}>
                {meta.text}
              </div>
            )}
          </div>
          {meta.kind === 'reaction' && meta.emoji && (
            <div className={cn('text-lg', isOwn ? 'text-white' : 'text-foreground')}>{meta.emoji}</div>
          )}
        </div>
      </button>

      {open && (
        <div className={modal.root} role="dialog" aria-modal="true">
          <button type="button" className={modal.dim} onClick={() => setOpen(false)} aria-label="Close" />
          <div className={cn(modal.shell, 'max-w-3xl')} onClick={(e) => e.stopPropagation()}>
            {loading && (
              <div className={cn(modal.body, 'text-sm text-muted-foreground')}>Loading story…</div>
            )}
            {!loading && group && group.length > 0 && (
              <StoryViewerModal
                open
                onClose={() => setOpen(false)}
                groups={group}
                initialAuthorId={group[0]?.author?.id}
                initialStoryId={meta.storyId}
                readOnly
                currentUserId={user?.id}
              />
            )}
            {!loading && group && group.length === 0 && (
              <div className={cn(modal.body, 'text-sm text-muted-foreground')}>
                Story is not available.
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

