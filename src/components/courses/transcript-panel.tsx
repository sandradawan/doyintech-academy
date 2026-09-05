"use client";

import { useEffect, useMemo, useRef } from "react";
import { Captions, Mic } from "lucide-react";
import { getTranscript, parseTimestampToSeconds } from "@/lib/courses/transcripts";
import { cn } from "@/lib/utils";

export function TranscriptPanel({
  lessonId,
  className,
  currentTime = 0,
  onSeek,
}: {
  lessonId: string;
  className?: string;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
}) {
  const transcript = useMemo(() => getTranscript(lessonId), [lessonId]);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const timedLines = useMemo(() => {
    if (!transcript) return [];
    return transcript.lines.map((line, index) => ({
      ...line,
      index,
      start: parseTimestampToSeconds(line.t),
    }));
  }, [transcript]);

  const activeIndex = useMemo(() => {
    if (!timedLines.length) return -1;
    let idx = 0;
    for (let i = 0; i < timedLines.length; i++) {
      if (timedLines[i].start <= currentTime + 0.25) idx = i;
      else break;
    }
    return idx;
  }, [timedLines, currentTime]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeIndex, lessonId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [lessonId]);

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
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <Mic className="size-3.5 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Voice transcript</p>
          <p className="truncate text-[11px] text-subtle">
            Auto-scrolls with the video · click a line to jump
          </p>
        </div>
        {currentTime > 0 ? (
          <span className="font-mono text-[10px] text-subtle tabular-nums">
            {formatClock(currentTime)}
          </span>
        ) : null}
      </div>
      <div ref={listRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
        {timedLines.map((line) => {
          const isActive = line.index === activeIndex;
          const isPast = line.index < activeIndex;
          return (
            <button
              key={line.index}
              type="button"
              ref={(el) => {
                lineRefs.current[line.index] = el;
              }}
              onClick={() => onSeek?.(line.start)}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-left transition-all",
                isActive &&
                  "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30",
                !isActive && isPast && "border-border/60 bg-bg/40 opacity-70",
                !isActive && !isPast && "border-border/80 bg-bg/80 hover:border-primary/40",
              )}
            >
              {line.t ? (
                <span
                  className={cn(
                    "mr-2 font-mono text-[10px] font-medium tabular-nums",
                    isActive ? "text-primary" : "text-subtle",
                  )}
                >
                  {line.t}
                </span>
              ) : null}
              <span
                className={cn(
                  "text-sm leading-relaxed",
                  isActive ? "text-fg font-medium" : "text-fg/85",
                )}
              >
                {line.text}
              </span>
            </button>
          );
        })}
        <p className="pt-2 text-[11px] text-subtle">
          Final quiz questions are generated from these notes after you finish the videos.
        </p>
      </div>
    </div>
  );
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
