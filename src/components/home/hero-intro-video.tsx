"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { youtubeThumb } from "@/lib/video-progress";
import { cn } from "@/lib/utils";

const INTRO_YOUTUBE_ID = "-KN5DFrhVOQ";

export function HeroIntroVideo({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = youtubeThumb(INTRO_YOUTUBE_ID, "max");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/15 bg-surface/95 shadow-xl shadow-black/20 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber-400/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-emerald-400/80" aria-hidden />
        <span className="ml-2 text-xs font-medium text-muted">Academy intro</span>
      </div>

      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            title="Doyintech Academy introduction"
            src={`https://www.youtube-nocookie.com/embed/${INTRO_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group relative size-full text-left"
            aria-label="Play academy introduction video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform group-hover:scale-105">
                <Play className="size-7 fill-current pl-0.5" aria-hidden />
              </span>
              <span className="text-center">
                <span className="block text-sm font-semibold text-white">Watch the intro</span>
                <span className="mt-1 block text-xs text-white/75">
                  Welcome to Doyintech Academy
                </span>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="text-sm font-semibold text-fg">Welcome to Doyintech Academy</p>
        <p className="mt-0.5 text-xs text-muted">
          See how courses, modules, and certificates work — then start learning.
        </p>
      </div>
    </div>
  );
}
