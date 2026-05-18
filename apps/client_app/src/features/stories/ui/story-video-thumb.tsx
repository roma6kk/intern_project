'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { Play } from 'lucide-react';

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
  // Keyed inner component remounts on `src` change, resetting local state
  // without setState inside an effect (keeps hooks purity/lints happy).
  return <StoryVideoThumbInner key={src} src={src} fill={fill} className={className} />;
}

function StoryVideoThumbInner({ src, fill, className }: Required<Pick<Props, 'src' | 'fill'>> & Pick<Props, 'className'>) {
  const didSeek = useRef(false);
  const [failed, setFailed] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    didSeek.current = false;
    // #region agent log
    fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H4',location:'story-video-thumb.tsx:useEffect',message:'StoryVideoThumb mounted/reset',data:{srcPresent:Boolean(src),fill},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [src, fill]);

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
    <div
      className={cn(
        fill ? 'absolute inset-0 h-full w-full' : 'h-full w-full',
        'relative overflow-hidden',
        className,
      )}
    >
      {!failed && (
        <video
          key={src}
          src={src}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover pointer-events-none select-none"
          onLoadedMetadata={(e) => seekToPreviewFrame(e.currentTarget)}
          onCanPlay={(e) => {
            // #region agent log
            fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H4',location:'story-video-thumb.tsx:onCanPlay',message:'Video canplay event',data:{readyState:e.currentTarget.readyState,duration:Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:null},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            if (!didSeek.current) seekToPreviewFrame(e.currentTarget);
          }}
          onLoadedData={(e) => {
            setHasFrame(true);
            // #region agent log
            fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H4',location:'story-video-thumb.tsx:onLoadedData',message:'Video loaded data',data:{readyState:e.currentTarget.readyState,currentTime:e.currentTarget.currentTime},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            if (!didSeek.current) seekToPreviewFrame(e.currentTarget);
          }}
          onSeeked={(e) => {
            setHasFrame(true);
            // #region agent log
            fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H4',location:'story-video-thumb.tsx:onSeeked',message:'Video seeked for preview frame',data:{currentTime:e.currentTarget.currentTime},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            try {
              e.currentTarget.pause();
            } catch {
              /* ignore */
            }
          }}
          onError={() => {
            setFailed(true);
            // #region agent log
            fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H5',location:'story-video-thumb.tsx:onError',message:'Video element error',data:{srcLength:src.length},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
          }}
          aria-hidden
        />
      )}
      {(failed || !hasFrame) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 text-muted-foreground">
          <Play size={16} className="opacity-80" />
        </div>
      )}
    </div>
  );
}
