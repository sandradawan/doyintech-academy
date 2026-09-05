"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Code2, ListChecks, Mic } from "lucide-react";
import { getTranscript, parseTimestampToSeconds } from "@/lib/courses/transcripts";
import { cn } from "@/lib/utils";

type Tab = "voiceover" | "takeaways" | "code";

export function TranscriptPanel({
  lessonId,
  className,
  currentTime = 0,
}: {
  lessonId: string;
  className?: string;
  currentTime?: number;
}) {
  const episode = useMemo(() => getTranscript(lessonId), [lessonId]);
  const [tab, setTab] = useState<Tab>("voiceover");
  const listRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const timedLines = useMemo(() => {
    if (!episode) return [];
    return episode.lines.map((line, index) => ({
      ...line,
      index,
      start: parseTimestampToSeconds(line.t),
    }));
  }, [episode]);

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
    setTab("voiceover");
    listRef.current?.scrollTo({ top: 0 });
  }, [lessonId]);

  useEffect(() => {
    if (tab !== "voiceover" || activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const parent = listRef.current;
    if (!el || !parent) return;
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
  }, [activeIndex, lessonId, tab]);

  if (!episode) {
    return (
      <div className={cn("p-4 text-sm text-muted", className)}>
        <p className="text-xs font-semibold tracking-wide text-subtle uppercase">Episode notes</p>
        <p className="mt-3">Notes for this episode will appear here while the video plays.</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Mic }[] = [
    { id: "voiceover", label: "Voiceover", icon: Mic },
    { id: "takeaways", label: "Takeaways", icon: ListChecks },
    { id: "code", label: "Code", icon: Code2 },
  ];

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="border-b border-border bg-surface px-3 py-2.5">
        <p className="text-[10px] font-semibold tracking-wider text-primary uppercase">This episode</p>
        <p className="mt-0.5 text-sm font-semibold text-fg">{episode.title}</p>
        <p className="mt-0.5 text-xs text-muted">{episode.focus}</p>
        {episode.objectives.length > 0 ? (
          <ul className="mt-2 space-y-0.5">
            {episode.objectives.map((o) => (
              <li key={o} className="flex gap-1.5 text-[11px] text-subtle">
                <BookOpen className="mt-0.5 size-3 shrink-0 text-primary/80" aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex border-b border-border bg-surface-2/40">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-semibold transition-colors",
              tab === id
                ? "border-b-2 border-primary text-primary"
                : "text-muted hover:text-fg",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
          </button>
        ))}
        {currentTime > 0 && tab === "voiceover" ? (
          <span className="flex items-center px-2 font-mono text-[10px] text-subtle tabular-nums">
            {formatClock(currentTime)}
          </span>
        ) : null}
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        {tab === "voiceover" ? (
          <div className="space-y-2">
            <p className="mb-2 text-[11px] text-subtle">
              Written voiceover of this video — highlights as you watch (does not control the player).
            </p>
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
          </div>
        ) : null}

        {tab === "takeaways" ? (
          <div className="space-y-3">
            <p className="text-[11px] text-subtle">
              Remember these points from this episode — the final quiz is built from them.
            </p>
            <ul className="space-y-2">
              {episode.takeaways.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-lg border border-border bg-bg/80 px-3 py-2.5 text-sm text-fg"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tab === "code" ? (
          <div className="space-y-4">
            {!episode.code?.length ? (
              <p className="text-sm text-muted">No code sample for this episode.</p>
            ) : (
              episode.code.map((block, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border">
                  <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-1.5 text-xs text-muted">
                    <Code2 className="size-3.5" aria-hidden />
                    <span className="font-medium text-fg">{block.title}</span>
                    <span className="ml-auto uppercase tracking-wide text-subtle">{block.lang}</span>
                  </div>
                  <pre className="overflow-x-auto bg-bg p-3 text-xs leading-relaxed text-fg">
                    <code>{block.code}</code>
                  </pre>
                </div>
              ))
            )}
          </div>
        ) : null}
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
