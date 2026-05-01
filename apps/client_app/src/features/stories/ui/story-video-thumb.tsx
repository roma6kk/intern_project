'use client';

import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/cn';

/** Heuristic when URL has no extension (e.g. signed S3 path). */
export function isProbablyVideoUrl(url: string): boolean {
  const path = (url.split('?')[0] ?? '').toLowerCase();
  return /\.(mp4|webm|mov|m4v|mkv|ogv)(\s|$)/.test(path);
}

type Props = {
  src: string;
  /** When true, video fills a `relative` parent via `absolute inset-0`. */
  fill?: boolean;
  className?: string;
};

/**
 * First-frame preview for story video URLs. Do not use `<img src={mp4}>` — it shows a broken image.
 */
export function StoryVideoThumb({ src, fill = true, className }: Props) {
  const didSeek = useRef(false);

  useEffect(() => {
    didSeek.current = false;
  }, [src]);

  const seekToPreviewFrame = useCallback((v: HTMLVideoElement) => {
    if (didSeek.current) return;
    try {
      if (v.readyState < 1) return;
      const d = v.duration;
      if (d && !Number.isNaN(d) && d > 0) {
        v.currentTime = Math.min(0.25, d * 0.02);
      } else {
        v.currentTime = 0.001;
      }
      didSeek.current = true;
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <video
      key={src}
      src={src}
      muted
      playsInline
      preload="metadata"
      className={cn(
        fill ? 'absolute inset-0 h-full w-full' : 'h-full w-full',
        'object-cover pointer-events-none select-none',
        className,
      )}
      onLoadedMetadata={(e) => seekToPreviewFrame(e.currentTarget)}
      onLoadedData={(e) => {
        if (!didSeek.current) seekToPreviewFrame(e.currentTarget);
      }}
      onSeeked={(e) => {
        try {
          e.currentTarget.pause();
        } catch {
          /* ignore */
        }
      }}
      aria-hidden
    />
  );
}
