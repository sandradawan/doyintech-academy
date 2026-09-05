"use client";

import { useMemo } from "react";
import { Captions, Mic } from "lucide-react";
import { getTranscript } from "@/lib/courses/transcripts";
import { cn } from "@/lib/utils";

export function TranscriptPanel({
  lessonId,
  className,
}: {
  lessonId: string;
  className?: string;
}) {
  const transcript = useMemo(() => getTranscript(lessonId), [lessonId]);

  if (!transcript) {
    return (
      <div className={cn("p-4 text-sm text-muted", className)}>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-subtle uppercase">
          <Captions className="size-3.5" /> Live caption / notes
        </p>
        <p className="mt-3 text-sm text-muted">
          Transcript notes for this lesson will appear here as captions while you watch the video.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <Mic className="size-3.5 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Voice transcript</p>
          <p className="truncate text-[11px] text-subtle">Live caption style · study notes from the video</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        {transcript.lines.map((line, i) => (
          <div
            key={i}
            className="rounded-lg border border-border/80 bg-bg/80 px-3 py-2.5 transition-colors hover:border-primary/30"
          >
            {line.t ? (
              <span className="mr-2 font-mono text-[10px] font-medium text-primary tabular-nums">{line.t}</span>
            ) : null}
            <span className="text-sm leading-relaxed text-fg/90">{line.text}</span>
          </div>
        ))}
        <p className="pt-2 text-[11px] text-subtle">
          Tip: Read along while the video plays. Your final quiz questions come from these notes.
        </p>
      </div>
    </div>
  );
}
