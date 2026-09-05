"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import {
  getVideoProgress,
  saveVideoProgress,
  youtubeThumb,
  type VideoProgressRecord,
} from "@/lib/video-progress";
import { cn } from "@/lib/utils";

type YTPlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: string | HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYoutubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;
  apiLoadPromise = new Promise((resolve) => {
    const prior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prior?.();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const check = setInterval(() => {
      if (window.YT?.Player) {
        clearInterval(check);
        resolve();
      }
    }, 40);
  });
  return apiLoadPromise;
}

export function VideoPlayer({
  videoId,
  youtubeId,
  title,
  className,
  thumbnailUrl,
  onComplete,
  onTimeUpdate,
  courseSlug,
  lessonId,
}: {
  videoId: string;
  youtubeId: string;
  title: string;
  className?: string;
  thumbnailUrl?: string;
  onComplete?: () => void;
  /** Optional — does not recreate the player (stored in a ref) */
  onTimeUpdate?: (seconds: number, duration: number) => void;
  courseSlug?: string;
  lessonId?: string;
}) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `yt-${reactId}`;
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onCompleteRef = useRef(onComplete);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState<VideoProgressRecord | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setProgress(getVideoProgress(videoId));
    completedRef.current = Boolean(getVideoProgress(videoId)?.completed);
  }, [videoId]);

  const persist = useCallback(
    (position: number, duration: number, forceComplete = false) => {
      if (!duration || duration <= 0) return;
      const percent = Math.round((position / duration) * 100);
      const rec = saveVideoProgress(
        videoId,
        {
          percent,
          position,
          duration,
          completed: forceComplete || percent >= 90,
        },
        courseSlug || lessonId ? { courseSlug, lessonId } : undefined,
      );
      setProgress(rec);
      if (rec.completed && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
    },
    [videoId, courseSlug, lessonId],
  );

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    loadYoutubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;
      const startAt = Math.floor(getVideoProgress(videoId)?.position ?? 0);
      playerRef.current = new window.YT.Player(containerId, {
        videoId: youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: startAt > 5 ? startAt : 0,
          autoplay: 1,
        },
        events: {
          onReady: (e) => {
            if (startAt > 5) e.target.seekTo(startAt, true);
          },
          onStateChange: (e) => {
            const YT = window.YT!;
            if (e.data === YT.PlayerState.ENDED) {
              const dur = e.target.getDuration();
              persist(dur, dur, true);
              onTimeUpdateRef.current?.(dur, dur);
            }
            if (e.data === YT.PlayerState.PLAYING) {
              if (pollRef.current) window.clearInterval(pollRef.current);
              pollRef.current = window.setInterval(() => {
                try {
                  const pos = e.target.getCurrentTime();
                  const dur = e.target.getDuration();
                  persist(pos, dur);
                  onTimeUpdateRef.current?.(pos, dur);
                } catch {
                  /* destroyed */
                }
              }, 500);
            }
            if (e.data === YT.PlayerState.PAUSED) {
              if (pollRef.current) {
                window.clearInterval(pollRef.current);
                pollRef.current = null;
              }
              try {
                const pos = e.target.getCurrentTime();
                const dur = e.target.getDuration();
                persist(pos, dur);
                onTimeUpdateRef.current?.(pos, dur);
              } catch {
                /* ignore */
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (pollRef.current) window.clearInterval(pollRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [active, containerId, persist, videoId, youtubeId]);

  const thumb = thumbnailUrl || youtubeThumb(youtubeId, "hq");
  const pct = progress?.percent ?? 0;

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      {active ? (
        <div className="relative aspect-video w-full">
          <div id={containerId} className="absolute inset-0 size-full" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group relative block aspect-video w-full"
          aria-label={`Play ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform group-hover:scale-105 sm:size-16">
              <Play className="size-7 fill-current pl-0.5" aria-hidden />
            </span>
            {pct > 0 ? (
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                {progress?.completed ? "Completed · Replay" : `Resume · ${pct}%`}
              </span>
            ) : null}
          </span>
          {pct > 0 ? (
            <span className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
              <span className="progress-bar block h-full bg-primary" style={{ width: `${pct}%` }} />
            </span>
          ) : null}
        </button>
      )}
      {active && pct > 0 ? (
        <div className="h-1 bg-surface-2">
          <div className="progress-bar h-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      ) : null}
    </div>
  );
}
