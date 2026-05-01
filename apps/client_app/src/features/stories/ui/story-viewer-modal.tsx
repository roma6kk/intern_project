'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Send, Users, EyeOff, Eye, Trash2 } from 'lucide-react';
import api from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';
import type { StoriesFeedGroup, StoryItem } from '../model/types';
import { STORY_QUICK_REACTIONS } from '../model/story-reactions';
import reactionsCss from './story-reactions.module.css';
import segmentProgressCss from './story-segment-progress.module.css';

const REACTION_EFFECT_MS = 1450;
const BURST_PARTICLE_COUNT = 30;

function burstClassForEmoji(emoji: string): string {
  switch (emoji) {
    case '🔥':
      return reactionsCss.fire;
    case '😂':
      return reactionsCss.laugh;
    case '😮':
    case '🤯':
      return reactionsCss.pop;
    case '👏':
    case '🙌':
      return reactionsCss.clap;
    case '🎉':
    case '💯':
      return reactionsCss.celebrate;
    case '👍':
      return reactionsCss.thumbs;
    case '✨':
      return reactionsCss.sparkle;
    case '😭':
      return reactionsCss.cry;
    case '💀':
      return reactionsCss.skull;
    case '😍':
      return reactionsCss.love;
    case '❤️':
    default:
      return reactionsCss.heart;
  }
}

function burstShadowForEmoji(emoji: string): string {
  switch (emoji) {
    case '🔥':
      return 'drop-shadow(0 12px 20px rgba(255, 140, 0, 0.4))';
    case '😂':
      return 'drop-shadow(0 12px 20px rgba(56, 189, 248, 0.35))';
    case '😮':
    case '🤯':
      return 'drop-shadow(0 12px 22px rgba(168, 85, 247, 0.35))';
    case '👏':
    case '🙌':
      return 'drop-shadow(0 10px 18px rgba(250, 204, 21, 0.35))';
    case '🎉':
    case '💯':
      return 'drop-shadow(0 10px 20px rgba(236, 72, 153, 0.35))';
    case '👍':
      return 'drop-shadow(0 12px 18px rgba(34, 197, 94, 0.35))';
    case '✨':
      return 'drop-shadow(0 8px 24px rgba(255, 255, 255, 0.45))';
    case '😭':
      return 'drop-shadow(0 10px 18px rgba(59, 130, 246, 0.35))';
    case '💀':
      return 'drop-shadow(0 8px 16px rgba(148, 163, 184, 0.4))';
    case '😍':
      return 'drop-shadow(0 12px 22px rgba(244, 114, 182, 0.4))';
    case '❤️':
    default:
      return 'drop-shadow(0 12px 20px rgba(255, 0, 92, 0.3))';
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  groups: StoriesFeedGroup[];
  initialAuthorId?: string;
  initialStoryId?: string;
  readOnly?: boolean;
  currentUserId?: string;
};

function asDate(v: string | Date) {
  return v instanceof Date ? v : new Date(v);
}

const IMAGE_AUTO_ADVANCE_MS = 7000;

export function StoryViewerModal({
  open,
  onClose,
  groups,
  initialAuthorId,
  initialStoryId,
  readOnly = false,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [authorIdx, setAuthorIdx] = useState(0);
  const [storyIdx, setStoryIdx] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);
  const [effects, setEffects] = useState<{ id: number; emoji: string }[]>([]);
  const [ownerHidden, setOwnerHidden] = useState<Record<string, boolean>>({});
  const [viewersOpen, setViewersOpen] = useState(false);
  const [viewersLoading, setViewersLoading] = useState(false);
  const [viewers, setViewers] = useState<
    Array<{
      id: string;
      createdAt: string | Date;
      viewer?: {
        id: string;
        account?: { username?: string };
        profile?: { firstName?: string; avatarUrl?: string | null };
      };
    }>
  >([]);
  const [viewersTotal, setViewersTotal] = useState(0);
  const autoTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);

  const normalized = useMemo(() => groups.filter((g) => g.stories?.length), [groups]);

  useEffect(() => {
    if (!open) return;
    if (normalized.length === 0) return;

    let ai = 0;
    let si = 0;
    if (initialAuthorId) {
      const found = normalized.findIndex((g) => g.author?.id === initialAuthorId);
      if (found >= 0) ai = found;
    }
    if (initialStoryId) {
      const foundStory = normalized[ai]?.stories?.findIndex((s) => s.id === initialStoryId) ?? -1;
      if (foundStory >= 0) si = foundStory;
    }
    setAuthorIdx(ai);
    setStoryIdx(si);
    setReplyText('');
  }, [open, normalized, initialAuthorId, initialStoryId]);

  const group = normalized[authorIdx];
  const story: StoryItem | undefined = group?.stories?.[storyIdx];
  const isOwnStory =
    !!currentUserId && !!group?.author?.id && group.author.id === currentUserId;

  const expired = story ? asDate(story.expiresAt).getTime() <= Date.now() : false;
  const effectiveReadOnly = readOnly || expired || isOwnStory;
  const storyHidden =
    (story?.id ? ownerHidden[story.id] : undefined) ??
    (story as unknown as { isHidden?: boolean } | undefined)?.isHidden ??
    false;

  const markViewed = useCallback(async (id: string) => {
    try {
      await api.post(`/stories/${id}/view`);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!open || !story?.id) return;
    if (effectiveReadOnly) return;
    void markViewed(story.id);
  }, [open, story?.id, markViewed, effectiveReadOnly]);

  const goNext = useCallback(() => {
    if (!normalized.length) return;
    const storiesCount = group?.stories?.length ?? 0;
    if (storyIdx + 1 < storiesCount) {
      setStoryIdx((s) => s + 1);
      return;
    }
    if (authorIdx + 1 < normalized.length) {
      setAuthorIdx((a) => a + 1);
      setStoryIdx(0);
      return;
    }
    onClose();
  }, [normalized.length, group?.stories?.length, storyIdx, authorIdx, onClose, group, normalized]);

  const goPrev = useCallback(() => {
    if (!normalized.length) return;
    if (storyIdx > 0) {
      setStoryIdx((s) => s - 1);
      return;
    }
    if (authorIdx > 0) {
      const prevAuthorIdx = authorIdx - 1;
      const prevStories = normalized[prevAuthorIdx]?.stories ?? [];
      setAuthorIdx(prevAuthorIdx);
      setStoryIdx(Math.max(prevStories.length - 1, 0));
    }
  }, [normalized, authorIdx, storyIdx]);

  const asset = story?.assets?.[0];
  const avatar = group?.author?.profile?.avatarUrl || '/default-avatar.svg';
  const username = group?.author?.username || 'Unknown';
  const triggerEffect = useCallback((emoji: string) => {
    const id = Date.now() + Math.random();
    setEffects((prev) => [...prev, { id, emoji }].slice(-3));
    window.setTimeout(() => {
      setEffects((prev) => prev.filter((e) => e.id !== id));
    }, REACTION_EFFECT_MS);
  }, []);

  // Keyboard UX (Esc / arrows)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, goPrev, goNext]);

  // Auto-advance for images (not for video). Disabled in read-only.
  useEffect(() => {
    if (!open) return;
    if (effectiveReadOnly) return;
    if (!asset) return;
    if (asset.type === 'VIDEO') return;

    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
    }
    autoTimerRef.current = window.setTimeout(() => {
      goNext();
    }, IMAGE_AUTO_ADVANCE_MS);

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [open, asset?.id, asset?.type, effectiveReadOnly, goNext, asset]);

  useEffect(() => {
    setVideoProgress(0);
  }, [asset?.id, asset?.type]);

  useEffect(() => {
    const v = videoRef.current;
    if (!open || !v || asset?.type !== 'VIDEO' || effectiveReadOnly) return;

    const tick = () => {
      if (!v.duration || !Number.isFinite(v.duration)) {
        setVideoProgress(0);
        return;
      }
      setVideoProgress(Math.min(1, v.currentTime / v.duration));
    };

    const onEnded = () => setVideoProgress(1);

    v.addEventListener('timeupdate', tick);
    v.addEventListener('loadedmetadata', tick);
    v.addEventListener('ended', onEnded);
    tick();

    return () => {
      v.removeEventListener('timeupdate', tick);
      v.removeEventListener('loadedmetadata', tick);
      v.removeEventListener('ended', onEnded);
    };
  }, [open, asset?.id, asset?.type, effectiveReadOnly]);

  const showImageAutoProgress =
    !effectiveReadOnly && !!asset && asset.type !== 'VIDEO';
  const showVideoProgress =
    !effectiveReadOnly && !!asset && asset.type === 'VIDEO';

  const setReaction = async (emoji: string) => {
    if (!story?.id || effectiveReadOnly) return;
    triggerEffect(emoji);
    try {
      await api.put(`/stories/${story.id}/reaction`, { emoji });
    } catch {
      // ignore
    }
  };

  const sendReply = async () => {
    if (!story?.id || effectiveReadOnly) return;
    const text = replyText.trim();
    if (!text) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/stories/${story.id}/reply`, { content: text });
      setReplyText('');
      const chatId = (data as { chatId?: string })?.chatId;
      if (chatId) {
        onClose();
        router.push(`/chat?chatId=${encodeURIComponent(chatId)}`);
      }
    } finally {
      setBusy(false);
    }
  };

  const openViewers = useCallback(async () => {
    if (!story?.id) return;
    setViewersOpen(true);
    setViewersLoading(true);
    try {
      const res = await api.get(`/stories/${story.id}/viewers?page=1&limit=50`);
      const rows = (res.data?.data ?? []) as typeof viewers;
      const total = (res.data?.meta?.total ?? 0) as number;
      setViewers(Array.isArray(rows) ? rows : []);
      setViewersTotal(total);
    } catch {
      setViewers([]);
      setViewersTotal(0);
    } finally {
      setViewersLoading(false);
    }
  }, [story?.id]);

  const toggleHidden = useCallback(async () => {
    if (!story?.id || expired) return;
    setBusy(true);
    try {
      const { data } = await api.patch(`/stories/${story.id}/toggle-hidden`);
      const isHidden = !!(data as { isHidden?: boolean } | undefined)?.isHidden;
      setOwnerHidden((prev) => ({ ...prev, [story.id]: isHidden }));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stories:changed'));
      }
    } finally {
      setBusy(false);
    }
  }, [story?.id, expired]);

  const deleteStory = useCallback(async () => {
    if (!story?.id) return;
    if (typeof window !== 'undefined' && !window.confirm('Delete this story?')) return;
    setBusy(true);
    try {
      await api.delete(`/stories/${story.id}`);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stories:changed'));
      }
      onClose();
    } finally {
      setBusy(false);
    }
  }, [story?.id, onClose]);

  if (!open) return null;

  const segments = group?.stories ?? [];

  return (
    <div className={cn(modal.root, 'overscroll-y-contain')} role="dialog" aria-modal="true">
      <button type="button" className={modal.dim} onClick={onClose} aria-label="Закрыть" />
      <div
        className={cn(modal.shell, 'max-w-3xl flex flex-col overscroll-y-contain')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn(modal.header, 'relative flex flex-col gap-3 py-3 shrink-0')}>
          {/* Progress segments + auto-advance fill on active story */}
          <div className="w-full shrink-0 px-0.5 pt-0.5 pb-1">
            <div className="flex gap-1.5">
              {segments.map((s, idx) => (
                <button
                  key={`seg-${s.id}`}
                  type="button"
                  onClick={() => setStoryIdx(idx)}
                  className="relative h-2 flex-1 min-w-0 rounded-full overflow-hidden bg-muted-foreground/25 p-0 border-0 cursor-pointer"
                  aria-label={`Go to story ${idx + 1}`}
                >
                  {idx < storyIdx ? (
                    <span className="absolute inset-0 block bg-primary/85" />
                  ) : null}
                  {idx === storyIdx ? (
                    showImageAutoProgress ? (
                      <span
                        key={`prog-${story?.id ?? idx}`}
                        className={cn(
                          'absolute inset-y-0 left-0 w-full block bg-primary',
                          segmentProgressCss.fillLinear,
                        )}
                        style={{
                          animationDuration: `${IMAGE_AUTO_ADVANCE_MS}ms`,
                        }}
                      />
                    ) : showVideoProgress ? (
                      <span
                        className="absolute inset-y-0 left-0 block bg-primary transition-[width] duration-150 ease-linear"
                        style={{ width: `${Math.round(videoProgress * 10000) / 100}%` }}
                      />
                    ) : (
                      <span className="absolute inset-0 block bg-primary/90" />
                    )
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border">
              <Image src={avatar} alt={username} width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-foreground truncate">{username}</div>
              {story?.expiresAt && (
                <div className="text-xs text-muted-foreground">
                  {expired ? 'Expired' : 'Active'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0 flex-wrap justify-end">
            {isOwnStory && (
              <>
                <button
                  type="button"
                  disabled={busy || expired}
                  onClick={() => void toggleHidden()}
                  className={cn(
                    'p-2 rounded-xl border transition disabled:opacity-50',
                    storyHidden ? 'bg-primary text-white border-primary/50' : 'bg-muted hover:bg-muted/80 border-border',
                  )}
                  aria-label={storyHidden ? 'Unhide story' : 'Hide story'}
                  title={expired ? 'Expired story' : storyHidden ? 'Unhide' : 'Hide'}
                >
                  {storyHidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void openViewers()}
                  className="p-2 rounded-xl border border-border bg-muted hover:bg-muted/80 transition disabled:opacity-50"
                  aria-label="Viewers"
                  title="Viewers"
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void deleteStory()}
                  className="p-2 rounded-xl border border-border bg-warning text-white hover:opacity-90 transition disabled:opacity-50"
                  aria-label="Delete"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={goPrev}
              className="p-2 rounded-xl hover:bg-muted"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="p-2 rounded-xl hover:bg-muted"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-muted"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          </div>
        </div>

        {viewersOpen && (
          <div className={modal.root} role="dialog" aria-modal="true">
            <button
              type="button"
              className={modal.dim}
              onClick={() => setViewersOpen(false)}
              aria-label="Close"
            />
            <div
              className={cn(modal.shell, 'max-w-lg')}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={modal.header}>
                <div>
                  <div className="text-sm font-semibold text-foreground">Viewers</div>
                  <div className="text-xs text-muted-foreground">Total: {viewersTotal}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewersOpen(false)}
                  className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs"
                >
                  Close
                </button>
              </div>
              <div className={cn(modal.body, 'gap-2')}>
                {viewersLoading ? (
                  <div className="text-sm text-muted-foreground">Loading…</div>
                ) : viewers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No viewers yet.</div>
                ) : (
                  <div className="space-y-2">
                    {viewers.map((v) => {
                      const u = v.viewer;
                      const username = u?.account?.username || u?.id || 'Unknown';
                      const firstName = u?.profile?.firstName || '';
                      const avatarUrl = u?.profile?.avatarUrl || '/default-avatar.svg';
                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between gap-3 border border-border rounded-2xl p-3 bg-background/30"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                              <Image
                                src={avatarUrl}
                                alt={username}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-foreground truncate">{username}</div>
                              <div className="text-xs text-muted-foreground truncate">{firstName}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0">
                            {new Date(v.createdAt).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 min-h-0 flex-col">
          <div
            className={cn(
              modal.body,
              'p-0 min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y',
            )}
            onWheel={(e) => e.stopPropagation()}
          >
          <div className="bg-black/90 flex items-center justify-center relative w-full max-w-full min-h-[min(36vh,260px)] max-h-[min(50vh,560px)] overflow-hidden shrink-0">
            {/* Click/tap zones */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
              aria-label="Previous story"
              style={{ background: 'transparent' }}
            />
            <button
              type="button"
              onClick={goNext}
              className="absolute inset-y-0 right-0 w-1/3 cursor-pointer"
              aria-label="Next story"
              style={{ background: 'transparent' }}
            />

            {!asset ? (
              <div className="text-white/70 text-sm">No media</div>
            ) : asset.type === 'VIDEO' ? (
              <video
                ref={videoRef}
                src={asset.url}
                controls
                autoPlay
                playsInline
                className="block max-w-full max-h-[min(50vh,560px)] w-auto h-auto mx-auto object-contain"
              />
            ) : (
              // Next/Image requires remotePatterns; we use plain img for simplicity here.
              <img
                src={asset.url}
                alt="story"
                className="block max-w-full max-h-[min(50vh,560px)] w-auto h-auto mx-auto object-contain select-none"
              />
            )}
          </div>

          {(story?.caption || !effectiveReadOnly || (effectiveReadOnly && !isOwnStory)) && (
            <div className="p-4 border-t border-border shrink-0 space-y-3">
              {story?.caption && (
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {story.caption}
                </div>
              )}

              {!effectiveReadOnly && (
                <div
                  className="grid grid-cols-4 sm:grid-cols-7 gap-2"
                  role="group"
                  aria-label="Story reactions"
                >
                  {STORY_QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => void setReaction(emoji)}
                      className={cn(
                        'min-h-[44px] rounded-2xl text-[1.35rem] leading-none',
                        'bg-muted/90 text-foreground border border-border/60',
                        'hover:bg-muted hover:border-border transition-colors duration-150',
                        'active:bg-muted/90 active:scale-100 shadow-sm',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                        'touch-manipulation select-none',
                      )}
                    >
                      <span className="inline-flex items-center justify-center w-full py-2">
                        {emoji}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {effectiveReadOnly && !isOwnStory && (
                <div className="text-xs text-muted-foreground">
                  {expired ? 'Expired stories are read-only.' : 'Read-only.'}
                </div>
              )}
            </div>
          )}
          </div>

          {!effectiveReadOnly && (
            <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 z-[2]">
              <div className="flex items-center gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to story…"
                  className="flex-1 min-w-0 border border-border rounded-xl px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void sendReply();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={busy || !replyText.trim()}
                  onClick={() => void sendReply()}
                  className="shrink-0 px-3 py-2 rounded-xl bg-primary text-white hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {effects.length > 0 && (
        <div className={reactionsCss.fullscreenLayer} aria-hidden>
          <div className={reactionsCss.burstArena}>
            {effects.flatMap((eff) => {
              const burstCls = burstClassForEmoji(eff.emoji);
              const burstShadow = burstShadowForEmoji(eff.emoji);
              return Array.from({ length: BURST_PARTICLE_COUNT }).map((_, i) => {
                const phase = (eff.id % 17) * 0.08;
                const angle =
                  (i / BURST_PARTICLE_COUNT) * Math.PI * 2 + (i % 5) * 0.22 + phase;
                const radius = 120 + ((i * 17 + eff.id * 3) % 180) + (i % 3) * 40;
                const dx = Math.round(Math.cos(angle) * radius);
                const dy = Math.round(Math.sin(angle) * radius * 0.72 + (i % 4) * 12 - 18);
                return (
                  <span
                    key={`${eff.id}-p-${i}`}
                    className={cn(reactionsCss.particle, burstCls)}
                    style={
                      {
                        ['--dx' as string]: `${dx}px`,
                        ['--dy' as string]: `${dy}px`,
                        filter: burstShadow,
                      } as React.CSSProperties
                    }
                  >
                    {eff.emoji}
                  </span>
                );
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
}

