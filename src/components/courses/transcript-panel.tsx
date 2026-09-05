"use client";

import { useEffect, useMemo, useRef } from "react";
import { Mic } from "lucide-react";
import { getTranscript, parseTimestampToSeconds } from "@/lib/courses/transcripts";
import { cn } from "@/lib/utils";

/**
 * Written voiceover notes for the video that is playing.
 * Highlights the current line as the video plays — does NOT seek or control the video.
 */
export function TranscriptPanel({
  lessonId,
  className,
  currentTime = 0,
}: {
  lessonId: string;
  className?: string;
  currentTime?: number;
}) {
  const transcript = useMemo(() => getTranscript(lessonId), [lessonId]);
  const listRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      if (timedLines[i].start <= currentTime + 0.35) idx = i;
      else break;
    }
    return idx;
  }, [timedLines, currentTime]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    if (!el || !listRef.current) return;
    const parent = listRef.current;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const viewTop = parent.scrollTop;
    const viewBottom = viewTop + parent.clientHeight;
    if (elTop < viewTop + 24 || elBottom > viewBottom - 24) {
      parent.scrollTo({
        top: Math.max(0, elTop - parent.clientHeight / 3),
        behavior: "smooth",
      });
    }
  }, [activeIndex, lessonId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [lessonId]);

  if (!transcript) {
    return (
      <div className={cn("p-4 text-sm text-muted", className)}>
        <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Voiceover notes</p>
        <p className="mt-3 text-sm text-muted">
          Written voiceover for this video will appear here while you watch.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <Mic className="size-3.5 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Voiceover</p>
          <p className="truncate text-[11px] text-subtle">
            Written narration of the video · follows playback
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
            <div
              key={line.index}
              ref={(el) => {
                lineRefs.current[line.index] = el;
              }}
              className={cn(
                "rounded-lg border px-3 py-2.5 transition-colors",
                isActive && "border-primary/50 bg-primary/10",
                !isActive && isPast && "border-border/50 bg-bg/50 opacity-75",
                !isActive && !isPast && "border-border/70 bg-bg/80",
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
                  isActive ? "font-medium text-fg" : "text-fg/90",
                )}
              >
                {line.text}
              </span>
            </div>
          );
        })}
        <p className="pt-2 text-[11px] text-subtle">
          This is the written voiceover of the video. Your final quiz is based on these notes.
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
