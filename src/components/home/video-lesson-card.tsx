"use client";

import Link from "next/link";
import { Clapperboard } from "lucide-react";
import type { LandingVideo } from "@/lib/content/landing";
import { VideoPlayer } from "@/components/media/video-player";
import { cn } from "@/lib/utils";

export function VideoLessonCard({
  video,
  featured,
}: {
  video: LandingVideo;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "card-lift flex flex-col overflow-hidden rounded-xl border border-border bg-surface",
        featured && "sm:col-span-2 lg:col-span-2",
      )}
    >
      <VideoPlayer
        videoId={video.id}
        youtubeId={video.youtubeId}
        title={video.title}
        thumbnailUrl={video.thumbnail}
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange">
            <Clapperboard className="size-3.5" aria-hidden />
            {video.course}
          </span>
          <span className="text-xs text-subtle">{video.duration}</span>
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
