"use client";

import { useEffect, useState } from "react";
import type { LessonContent } from "@/lib/courses/content";
import { contentPath, lessonBody } from "@/lib/courses/content";
import { VideoPlayer } from "@/components/media/video-player";
import { CheckCircle2, Code2, ListChecks } from "lucide-react";

export function LessonContentPanel({
  lessonId,
  youtubeId: youtubeOverride,
  onVideoComplete,
  courseSlug,
}: {
  lessonId: string;
  youtubeId?: string | null;
  onVideoComplete?: () => void;
  courseSlug?: string;
}) {
  const [data, setData] = useState<LessonContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/lessons/${encodeURIComponent(lessonId)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "not_found" : "load_failed");
        return res.json() as Promise<LessonContent>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setData(null);
          setError(e.message === "not_found" ? "not_found" : "load_failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  if (loading) {
    return <p className="mt-3 text-xs text-subtle">Loading lesson…</p>;
  }
  if (error === "not_found" || !data) {
    // Still allow playlist video override when JSON is missing
    if (youtubeOverride) {
      return (
        <div className="mt-3 space-y-4 rounded-lg border border-border bg-bg p-3 sm:p-4">
          <VideoPlayer
            videoId={`lesson-${lessonId}`}
            youtubeId={youtubeOverride}
            title="Lesson video"
            className="rounded-lg border border-border"
            onComplete={onVideoComplete}
            courseSlug={courseSlug}
            lessonId={lessonId}
          />
          <p className="text-xs text-subtle">Watch ≥90% of the video to unlock the next lesson.</p>
        </div>
      );
    }
    return (
      <p className="mt-3 text-xs text-subtle">
        Full lesson content is being published. Summary above still applies.
      </p>
    );
  }

  const body = lessonBody(data);
  const youtubeId = youtubeOverride || data.youtubeId || undefined;

  return (
    <div className="mt-3 space-y-4 rounded-lg border border-border bg-bg p-3 sm:p-4">
      {youtubeId ? (
        <VideoPlayer
          videoId={`lesson-${data.id}`}
          youtubeId={youtubeId}
          title={data.title}
          thumbnailUrl={data.thumbnail}
          className="rounded-lg border border-border"
          onComplete={onVideoComplete}
          courseSlug={courseSlug}
          lessonId={lessonId}
        />
      ) : null}

      {data.goals?.length ? (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            <CheckCircle2 className="size-3.5" aria-hidden /> Goals
          </p>
          <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm text-muted">
            {data.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {body ? (
        <div className="prose-sm max-w-none space-y-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">
          {body}
        </div>
      ) : null}

      {data.codeBlocks?.map((block, i) => (
        <div key={i} className="overflow-hidden rounded-md border border-border">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-xs text-muted">
            <Code2 className="size-3.5" aria-hidden />
            {block.title || block.lang}
          </div>
          <pre className="overflow-x-auto bg-surface p-3 text-xs text-fg">
            <code>{block.code}</code>
          </pre>
        </div>
      ))}

      {data.practice ? (
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-semibold text-primary">Practice</p>
          <p className="mt-1 text-sm text-muted">{data.practice.prompt}</p>
          {data.practice.starter ? (
            <pre className="mt-2 overflow-x-auto rounded bg-surface p-2 text-xs">
              <code>{data.practice.starter}</code>
            </pre>
          ) : null}
        </div>
      ) : null}

      {data.quiz && data.quiz.length > 0 ? (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            <ListChecks className="size-3.5" aria-hidden /> Check yourself
          </p>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            {data.quiz.map((q, i) => (
              <li key={i} className="rounded-md border border-border px-3 py-2">
                {q.question || q.q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
