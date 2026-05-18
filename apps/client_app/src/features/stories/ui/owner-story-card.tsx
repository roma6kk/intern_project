'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

import type { StoryItem } from '@/features/stories/model/types';
import { StoryVideoThumb } from '@/features/stories/ui/story-video-thumb';

type MyStory = StoryItem & {
  _count?: { views?: number; reactions?: number };
  isHidden?: boolean;
};

export function OwnerStoryCard({
  story,
  onOpen,
}: {
  story: MyStory;
  onOpen: () => void;
}) {
  const asset = story.assets?.[0];
  const thumb = asset?.url;
  const isVideo = asset?.type === 'VIDEO';

  const caption = (story.caption ?? '').trim();
  const title = caption ? caption : 'Story';
  const views = story._count?.views ?? 0;
  const reactions = story._count?.reactions ?? 0;
  const hidden = !!story.isHidden;

  const createdAtText = useMemo(() => {
    const d = story.createdAt instanceof Date ? story.createdAt : new Date(story.createdAt);
    return d.toLocaleString();
  }, [story.createdAt]);

  return (
    <div className="group relative border border-border rounded-2xl p-3 bg-background/30 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-3 min-w-0 flex-1 text-left"
          aria-label="Open story"
        >
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border flex items-center justify-center">
            {thumb ? (
              isVideo ? (
                <>
                  <StoryVideoThumb src={thumb} />
                  <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-lg bg-black/55 flex items-center justify-center pointer-events-none">
                    <Play className="w-3.5 h-3.5 text-white" />
                  </div>
                </>
              ) : (
                <Image
                  src={thumb}
                  alt="story"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="text-xs text-muted-foreground">No media</div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{title}</div>
              {hidden && (
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  Hidden
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {createdAtText} · Views: {views} · Reactions: {reactions}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

