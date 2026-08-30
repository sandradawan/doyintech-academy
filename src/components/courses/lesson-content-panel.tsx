"use client";

import { useEffect, useState } from "react";
import type { LessonContent } from "@/lib/courses/content";
import { contentPath } from "@/lib/courses/content";
import { CheckCircle2, Code2, ListChecks, PlayCircle } from "lucide-react";

export function LessonContentPanel({ lessonId }: { lessonId: string }) {
  const [data, setData] = useState<LessonContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(contentPath(lessonId))
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
    return <p className="mt-3 text-xs text-subtle">Loading lesson content…</p>;
  }

  if (error === "not_found" || !data) {
    return (
      <p className="mt-3 text-xs text-subtle">
        Full lesson content is being produced. Summary above still applies — mark complete when you have practiced the topic.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-4 rounded-lg border border-border/80 bg-bg/40 p-3">
      {data.goals?.length ? (
        <div>
          <p className="text-xs font-semibold tracking-wide text-cyan uppercase">Goals</p>
          <ul className="mt-1.5 space-y-1">
            {data.goals.map((g) => (
              <li key={g} className="flex gap-2 text-sm text-muted">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-cyan" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.bodyMd ? (
        <div className="prose-lesson space-y-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">
          {data.bodyMd}
        </div>
      ) : null}

      {data.codeBlocks?.map((block, i) => (
        <div key={i} className="overflow-hidden rounded-md border border-border bg-surface-2/80">
          <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-xs text-subtle">
            <Code2 className="size-3.5" />
            {block.title || block.lang}
          </div>
          <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-fg">
            <code>{block.code}</code>
          </pre>
        </div>
      ))}

      {data.practice ? (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
          <p className="text-xs font-semibold text-primary">Practice</p>
          <p className="mt-1 text-sm text-muted">{data.practice.prompt}</p>
          {data.practice.starter ? (
            <pre className="mt-2 overflow-x-auto rounded bg-surface-2 p-2 text-xs text-fg">
              <code>{data.practice.starter}</code>
            </pre>
          ) : null}
        </div>
      ) : null}

      {data.quiz?.length ? (
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-cyan uppercase">
            <ListChecks className="size-3.5" /> Check yourself
          </p>
          <ul className="mt-2 space-y-3">
            {data.quiz.map((item, qi) => (
              <li key={qi} className="text-sm text-muted">
                <p className="font-medium text-fg">
                  {qi + 1}. {item.question}
                </p>
                <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs">
                  {item.choices.map((c, ci) => (
                    <li key={ci} className={ci === item.answerIndex ? "text-cyan" : undefined}>
                      {c}
                      {ci === item.answerIndex ? " ✓" : ""}
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {data.video && data.video.status !== "skipped" ? (
        <div className="rounded-md border border-border bg-surface-2/50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
            <PlayCircle className="size-3.5" /> Video
          </p>
          {data.video.url ? (
            <a href={data.video.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-primary hover:underline">
              Watch lesson video
            </a>
          ) : (
            <p className="mt-1 text-xs text-subtle">
              Script ready — rendered video URL will appear here when published.
            </p>
          )}
          {data.video.script ? (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-muted hover:text-fg">
                Read video script / transcript
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-muted whitespace-pre-wrap">{data.video.script}</p>
            </details>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
