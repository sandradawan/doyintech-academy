"use client";

import { FormEvent, useEffect, useState } from "react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import {
  fetchContentOverrides,
  saveContentOverrideDb,
  type ContentOverrideRow,
} from "@/lib/admin-crm";

export default function AdminContentPage() {
  const [selectedSlug, setSelectedSlug] = useState(courses[0]?.slug || "");
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [body, setBody] = useState("");
  const [quizJson, setQuizJson] = useState("[]");
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [loadingStatic, setLoadingStatic] = useState(false);
  const [overrides, setOverrides] = useState<ContentOverrideRow[]>([]);

  const course = courses.find((c) => c.slug === selectedSlug);
  const lessons = course?.modules.flatMap((m) => m.lessons) || [];

  useEffect(() => {
    fetchContentOverrides().then(setOverrides).catch(() => setOverrides([]));
  }, []);

  async function loadLesson(id: string) {
    setLessonId(id);
    setError("");
    const existing = overrides.find((o) => o.courseSlug === selectedSlug && o.lessonId === id);
    const lesson = lessons.find((l) => l.id === id);
    setTitle(existing?.title || lesson?.title || "");
    setSummary(existing?.summary || lesson?.summary || "");
    setVideoUrl(existing?.videoUrl || "");
    setYoutubeId(existing?.youtubeId || "");
    setBody(existing?.body || "");
    setQuizJson(existing?.quizJson ? JSON.stringify(existing.quizJson, null, 2) : "[]");

    if (!existing?.body) {
      setLoadingStatic(true);
      try {
        const res = await fetch(`/api/lessons/${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.title && !existing?.title) setTitle(data.title);
          if (data.body) setBody(typeof data.body === "string" ? data.body : "");
          if (data.youtubeId && !existing?.youtubeId) setYoutubeId(data.youtubeId);
          if (Array.isArray(data.quiz) && data.quiz.length && !existing?.quizJson) {
            const normalized = data.quiz.map(
              (
                q: {
                  id?: string;
                  prompt?: string;
                  q?: string;
                  question?: string;
                  choices?: string[];
                  correctIndex?: number;
                  answer?: number;
                  answerIndex?: number;
                  explain?: string;
                },
                i: number,
              ) => ({
                id: q.id || `q${i + 1}`,
                prompt: q.prompt || q.q || q.question || "",
                choices: q.choices || [],
                correctIndex: q.correctIndex ?? q.answerIndex ?? q.answer ?? 0,
                explain: q.explain,
              }),
            );
            setQuizJson(JSON.stringify(normalized, null, 2));
          }
        }
      } catch {
        /* optional */
      } finally {
        setLoadingStatic(false);
      }
    }
  }

  async function saveLesson(e: FormEvent) {
    e.preventDefault();
    if (!lessonId) return;
    setError("");
    let parsedQuiz: unknown[] = [];
    try {
      const q = JSON.parse(quizJson || "[]");
      if (!Array.isArray(q)) throw new Error("Quiz must be a JSON array");
      parsedQuiz = q;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid quiz JSON");
      return;
    }
    try {
      await saveContentOverrideDb({
        courseSlug: selectedSlug,
        lessonId,
        title: title.trim() || undefined,
        summary: summary.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        youtubeId: youtubeId.trim() || undefined,
        body: body.trim() || undefined,
        quizJson: parsedQuiz,
      });
      setOverrides(await fetchContentOverrides());
      setSavedMsg("Saved to Supabase.");
      setTimeout(() => setSavedMsg(""), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Lesson editor</h1>
        <p className="mt-1 text-sm text-muted">
          Edit title, body, YouTube ID, and multi-question quiz. Saves to content_overrides.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => {
              setSelectedSlug(c.slug);
              setLessonId("");
            }}
            className={`rounded-xl border p-4 text-left ${
              selectedSlug === c.slug ? "border-primary bg-primary/5" : "border-border bg-surface"
            }`}
          >
            <p className="font-display text-sm font-semibold">{c.title}</p>
            <p className="mt-1 text-xs text-muted">
              {c.modules.length} modules · {courseLessonCount(c)} lessons
            </p>
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="px-2 text-xs font-semibold tracking-wide text-muted uppercase">Lessons</p>
          <ul className="mt-2 max-h-[36rem] space-y-0.5 overflow-y-auto">
            {lessons.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => void loadLesson(l.id)}
                  className={`w-full rounded-md px-2 py-2 text-left text-xs ${
                    lessonId === l.id ? "bg-primary/10 font-semibold" : "text-muted hover:bg-surface-2"
                  }`}
                >
                  <span className="block truncate">{l.title}</span>
                  <span className="block truncate text-[10px] text-subtle">{l.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={saveLesson} className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">
              {lessonId ? `Editing ${lessonId}` : "Select a lesson"}
              {loadingStatic ? (
                <span className="ml-2 text-xs font-normal text-muted">Loading static…</span>
              ) : null}
            </p>
            {youtubeId ? (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-primary hover:underline"
              >
                Preview video
              </a>
            ) : null}
          </div>
          <label className="block text-sm">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!lessonId}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
          <label className="block text-sm">
            Summary
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={!lessonId}
              rows={2}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              YouTube ID
              <input
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value.trim())}
                disabled={!lessonId}
                placeholder="e.g. dQw4w9WgXcQ"
                className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm disabled:opacity-50"
              />
            </label>
            <label className="block text-sm">
              Video URL (optional)
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={!lessonId}
                placeholder="https://…"
                className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm disabled:opacity-50"
              />
            </label>
          </div>
          <label className="block text-sm">
            Body (Markdown / text)
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!lessonId}
              rows={12}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs leading-relaxed disabled:opacity-50"
            />
          </label>
          <label className="block text-sm">
            Quiz JSON
            <span className="ml-1 text-xs font-normal text-muted">
              Array of id, prompt, choices, correctIndex, explain?
            </span>
            <textarea
              value={quizJson}
              onChange={(e) => setQuizJson(e.target.value)}
              disabled={!lessonId}
              rows={10}
              spellCheck={false}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs leading-relaxed disabled:opacity-50"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!lessonId}
              className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-50"
            >
              Save to database
            </button>
            {savedMsg ? <span className="text-sm text-success">{savedMsg}</span> : null}
            <span className="text-xs text-subtle">{overrides.length} DB overrides</span>
          </div>
        </form>
      </div>
    </div>
  );
}
