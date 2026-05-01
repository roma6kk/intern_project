'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import api from '@/shared/api';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';
import type { StoryItem } from '@/features/stories/model/types';
import { StoryViewerModal } from '@/features/stories/ui/story-viewer-modal';
import Link from 'next/link';
import modal from '@/shared/styles/modal.module.css';
import { useAuth } from '@/entities/session';
import { OwnerStoryCard } from '@/features/stories/ui/owner-story-card';
import { StoryVideoThumb } from '@/features/stories/ui/story-video-thumb';

type MyStory = StoryItem & {
  author?: { id: string; username?: string; profile?: { avatarUrl?: string | null } };
  _count?: { views?: number; reactions?: number };
  isHidden?: boolean;
};

type ViewerRow = {
  id: string;
  createdAt: string | Date;
  viewer?: {
    id: string;
    account?: { username?: string };
    profile?: { firstName?: string; avatarUrl?: string | null };
  };
};

type ExclusionRow = {
  id: string;
  excludedUserId: string;
  excludedUser?: {
    id: string;
    account?: { username?: string };
    profile?: { firstName?: string; avatarUrl?: string | null };
  };
};

type Suggestion = {
  userId: string;
  username: string;
  firstName?: string | null;
  avatarUrl?: string | null;
};

export default function StoriesManagePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'active' | 'expired'>('active');
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<MyStory[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStoryId, setViewerStoryId] = useState<string | undefined>(undefined);

  const [viewersOpen, setViewersOpen] = useState(false);
  const [viewersLoading, setViewersLoading] = useState(false);
  const [viewersStoryId, setViewersStoryId] = useState<string | null>(null);
  const [viewers, setViewers] = useState<ViewerRow[]>([]);
  const [viewersTotal, setViewersTotal] = useState(0);

  const [exclusions, setExclusions] = useState<ExclusionRow[]>([]);
  const [exclLoading, setExclLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const loadStories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stories/me?status=${tab}`);
      setStories(Array.isArray(data) ? (data as MyStory[]) : []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  const loadExclusions = useCallback(async () => {
    setExclLoading(true);
    try {
      const { data } = await api.get('/stories/exclusions/list');
      setExclusions(Array.isArray(data) ? (data as ExclusionRow[]) : []);
    } catch {
      setExclusions([]);
    } finally {
      setExclLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories();
  }, [loadStories]);

  useEffect(() => {
    const handler = () => void loadStories();
    window.addEventListener('stories:changed', handler as EventListener);
    return () => window.removeEventListener('stories:changed', handler as EventListener);
  }, [loadStories]);

  useEffect(() => {
    void loadExclusions();
  }, [loadExclusions]);

  const groupsForViewer = useMemo(() => {
    // Viewer expects grouped feed; for management we only show one “author” group.
    return [
      {
        author: {
          id: user?.id ?? 'me',
          username: user?.username ?? 'My stories',
          profile: { avatarUrl: user?.profile?.avatarUrl ?? null, isPrivate: true },
        },
        stories: stories.map((s) => ({
          id: s.id,
          createdAt: s.createdAt,
          expiresAt: s.expiresAt,
          caption: s.caption ?? null,
          assets: s.assets ?? [],
          // optional field used by owner controls in viewer
          isHidden: s.isHidden,
          seen: true,
        })),
        hasUnseen: false,
      },
    ];
  }, [stories]);

  const onPickFiles = (f: FileList | null) => {
    if (!f) return;
    // One media per story in UI (matches product request)
    const next = Array.from(f).slice(0, 1);
    setFiles(next);
  };

  useEffect(() => {
    // Generate local previews; revoke on cleanup.
    const urls = files.map((f) => URL.createObjectURL(f));
    setFilePreviews(urls);
    return () => {
      for (const u of urls) URL.revokeObjectURL(u);
    };
  }, [files]);

  const createStory = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      if (caption.trim()) fd.append('caption', caption.trim());
      for (const f of files) fd.append('files', f);
      await api.post('/stories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCaption('');
      setFiles([]);
      setFilePreviews([]);
      await loadStories();
    } finally {
      setUploading(false);
    }
  };

  const toggleHidden = async (id: string) => {
    await api.patch(`/stories/${id}/toggle-hidden`);
    await loadStories();
  };

  const removeStory = async (id: string) => {
    await api.delete(`/stories/${id}`);
    await loadStories();
  };

  const openViewers = async (id: string) => {
    setViewersOpen(true);
    setViewersStoryId(id);
    setViewersLoading(true);
    try {
      const res = await api.get(`/stories/${id}/viewers?page=1&limit=50`);
      const rows = (res.data?.data ?? []) as ViewerRow[];
      const total = (res.data?.meta?.total ?? 0) as number;
      setViewers(rows);
      setViewersTotal(total);
    } catch {
      setViewers([]);
      setViewersTotal(0);
    } finally {
      setViewersLoading(false);
    }
  };

  const searchSuggestions = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const { data } = await api.get(
        `/stories/exclusions/suggestions?query=${encodeURIComponent(trimmed)}&limit=10`,
      );
      setSuggestions(Array.isArray(data) ? (data as Suggestion[]) : []);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void searchSuggestions(query), 250);
    return () => clearTimeout(t);
  }, [query, searchSuggestions]);

  const addExclusion = async (userId: string) => {
    await api.post('/stories/exclusions', { excludedUserId: userId });
    setQuery('');
    setSuggestions([]);
    await loadExclusions();
  };

  const removeExclusion = async (userId: string) => {
    await api.delete(`/stories/exclusions/${encodeURIComponent(userId)}`);
    await loadExclusions();
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-4">
        <div className={cn(surface.card, animations.slideUp, 'p-4 rika-glow-edge')}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Stories</h1>
              <p className="text-sm text-muted-foreground">
                Create, manage, and review active/expired stories.
              </p>
            </div>
            <Link href="/feed" className="text-sm text-primary hover:opacity-90">
              Back to feed
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="grid gap-2">
              <label className="text-sm text-muted-foreground font-medium">Caption (optional)</label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border border-border rounded-xl px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
                placeholder="Write something…"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm text-muted-foreground font-medium">Media (1 file)</label>
              <label className="flex items-center justify-between gap-3 border border-border rounded-2xl px-3 py-3 bg-background/30 hover:bg-muted/40 cursor-pointer">
                <span className="text-sm text-foreground font-medium">Choose files</span>
                <span className="text-xs text-muted-foreground">image/video</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onPickFiles(e.target.files)}
                  className="hidden"
                />
              </label>
              <div className="text-xs text-muted-foreground">
                Selected: {files.length}
              </div>

              {filePreviews.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {filePreviews.map((src, idx) => (
                    <div
                      key={`preview-${idx}`}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted shrink-0"
                      title={files[idx]?.name}
                    >
                      {files[idx]?.type?.startsWith('video/') ? (
                        <StoryVideoThumb src={src} />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={uploading || files.length === 0}
                onClick={() => void createStory()}
                className="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Publish story'}
              </button>
            </div>
          </div>
        </div>

        <div className={cn(surface.card, animations.slideUp, 'p-4 rika-glow-edge')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('active')}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium',
                  tab === 'active' ? 'bg-primary text-white' : 'bg-muted text-foreground',
                )}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setTab('expired')}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium',
                  tab === 'expired' ? 'bg-primary text-white' : 'bg-muted text-foreground',
                )}
              >
                Expired
              </button>
            </div>

            <button
              type="button"
              onClick={() => void loadStories()}
              className="text-sm text-primary hover:opacity-90"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : stories.length === 0 ? (
              <div className="text-sm text-muted-foreground">No stories.</div>
            ) : (
              stories.map((s) => (
                <OwnerStoryCard
                  key={s.id}
                  story={s}
                  onOpen={() => {
                    setViewerStoryId(s.id);
                    setViewerOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className={cn(surface.card, animations.slideUp, 'p-4 rika-glow-edge')}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Story exclusions</h2>
              <p className="text-xs text-muted-foreground">
                Excluded users will not see your stories (global).
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadExclusions()}
              className="text-sm text-primary hover:opacity-90"
              disabled={exclLoading}
            >
              Refresh
            </button>
          </div>

          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type username to exclude…"
              className="w-full border border-border rounded-xl px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
            {suggestionsLoading && (
              <div className="text-xs text-muted-foreground mt-2">Searching…</div>
            )}
            {!suggestionsLoading && suggestions.length > 0 && (
              <div className="mt-2 border border-border rounded-xl overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.userId}
                    type="button"
                    onClick={() => void addExclusion(s.userId)}
                    className="w-full flex items-center gap-3 px-3 py-2 bg-background hover:bg-muted text-left"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                      <Image
                        src={s.avatarUrl || '/default-avatar.svg'}
                        alt={s.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {s.username}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.firstName || ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {exclLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : exclusions.length === 0 ? (
              <div className="text-sm text-muted-foreground">No excluded users.</div>
            ) : (
              exclusions.map((e) => {
                const u = e.excludedUser;
                const username = u?.account?.username || e.excludedUserId;
                const avatar = u?.profile?.avatarUrl || '/default-avatar.svg';
                return (
                  <div
                    key={e.id}
                    className="flex items-center justify-between gap-3 border border-border rounded-2xl p-3 bg-background/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                        <Image
                          src={avatar}
                          alt={username}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {username}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {u?.profile?.firstName || ''}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeExclusion(e.excludedUserId)}
                      className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <StoryViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        groups={groupsForViewer}
        initialAuthorId={user?.id ?? 'me'}
        initialStoryId={viewerStoryId}
        readOnly={tab === 'expired'}
        currentUserId={user?.id}
      />

      {/* Viewers modal */}
      {viewersOpen && (
        <div className={modal.root} role="dialog" aria-modal="true">
          <button
            type="button"
            className={modal.dim}
            onClick={() => {
              setViewersOpen(false);
              setViewersStoryId(null);
            }}
            aria-label="Close"
          />
          <div
            className={cn(modal.shell, 'max-w-lg')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modal.header}>
              <div>
                <div className="text-sm font-semibold text-foreground">Viewers</div>
                <div className="text-xs text-muted-foreground">
                  Total: {viewersTotal}
                  {viewersStoryId ? ` · Story ${viewersStoryId.slice(0, 8)}…` : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setViewersOpen(false);
                  setViewersStoryId(null);
                }}
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
                    const avatar = u?.profile?.avatarUrl || '/default-avatar.svg';
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between gap-3 border border-border rounded-2xl p-3 bg-background/30"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                            <Image
                              src={avatar}
                              alt={username}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {username}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {firstName}
                            </div>
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
    </div>
  );
}

