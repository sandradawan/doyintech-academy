"use client";

import { useState } from "react";
import Link from "next/link";
import { Clapperboard, Play } from "lucide-react";
import type { LandingVideo } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

export function VideoLessonCard({
  video,
  featured,
}: {
  video: LandingVideo;
  featured?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <article
      className={cn(
        "card-lift flex flex-col overflow-hidden rounded-xl border border-border bg-surface",
        featured && "sm:col-span-2 lg:col-span-2",
      )}
    >
      <div className="relative aspect-video bg-surface-2">
        {playing ? (
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/20 via-surface-2 to-orange/15"
            aria-label={`Play ${video.title}`}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform group-hover:scale-105">
              <Play className="size-7 fill-current pl-0.5" aria-hidden />
            </span>
            <span className="text-xs font-medium text-muted">{video.duration}</span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange">
            <Clapperboard className="size-3.5" aria-hidden />
            {video.course}
          </span>
          {video.topics.map((t) => (
            <span
              key={t}
              className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{video.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{video.summary}</p>
        <Link
          href={`/courses/${video.courseSlug}`}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Open full course →
        </Link>
      </div>
    </article>
  );
}
