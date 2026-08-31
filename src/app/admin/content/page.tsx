"use client";

import { FormEvent, useEffect, useState } from "react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import { getOverrides, saveOverride, type ContentOverride } from "@/lib/admin";
import { pushActivity } from "@/lib/admin-crm";

export default function AdminContentPage() {
  const [selectedSlug, setSelectedSlug] = useState(courses[0]?.slug || "");
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [body, setBody] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [overrides, setOverrides] = useState<ContentOverride[]>([]);

  const course = courses.find((c) => c.slug === selectedSlug);
  const lessons = course?.modules.flatMap((m) => m.lessons) || [];

  useEffect(() => {
    setOverrides(getOverrides());
  }, []);

  function loadLesson(id: string) {
    setLessonId(id);
    const existing = getOverrides().find((o) => o.courseSlug === selectedSlug && o.lessonId === id);
    const lesson = lessons.find((l) => l.id === id);
    setTitle(existing?.title || lesson?.title || "");
    setSummary(existing?.summary || lesson?.summary || "");
    setVideoUrl(existing?.videoUrl || "");
    setBody(existing?.body || "");
  }

  function saveLesson(e: FormEvent) {
    e.preventDefault();
    if (!lessonId) return;
    saveOverride({
      courseSlug: selectedSlug,
      lessonId,
      title: title.trim() || undefined,
      summary: summary.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      body: body.trim() || undefined,
    });
    setOverrides(getOverrides());
    pushActivity({
      type: "content",
      message: `Updated content for ${lessonId} (${selectedSlug})`,
      meta: { lessonId, courseSlug: selectedSlug },
    });
    setSavedMsg("Lesson content saved.");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-muted">
          Catalog overview and lesson overrides (title, summary, video URL, body).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => {
              setSelectedSlug(c.slug);
              setLessonId("");
            }}
            className={`rounded-xl border p-4 text-left transition-colors ${
              selectedSlug === c.slug
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:border-primary/40"
            }`}
          >
            <p className="font-display text-sm font-semibold">{c.title}</p>
            <p className="mt-1 text-xs text-muted">
              {c.modules.length} modules · {courseLessonCount(c)} lessons · {c.level}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="px-2 text-xs font-semibold tracking-wide text-muted uppercase">Lessons</p>
          <ul className="mt-2 max-h-[28rem] space-y-0.5 overflow-y-auto">
            {lessons.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => loadLesson(l.id)}
                  className={`w-full rounded-md px-2 py-2 text-left text-xs ${
                    lessonId === l.id ? "bg-primary/10 font-semibold text-fg" : "text-muted hover:bg-surface-2"
                  }`}
                >
                  <span className="block truncate">{l.title}</span>
                  <span className="text-[10px] text-subtle">
                    {l.kind} · {l.durationMin}m
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={saveLesson} className="space-y-4 rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold">
            {lessonId ? `Editing ${lessonId}` : "Select a lesson"}
          </p>
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
          <label className="block text-sm">
            Video URL (YouTube or hosted)
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={!lessonId}
              placeholder="https://…"
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm disabled:opacity-50"
            />
          </label>
          <label className="block text-sm">
            Body / write-up (markdown or plain text)
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!lessonId}
              rows={10}
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs leading-relaxed disabled:opacity-50"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!lessonId}
              className="h-10 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg disabled:opacity-50"
            >
              Save override
            </button>
            {savedMsg ? <span className="text-sm text-success">{savedMsg}</span> : null}
            <span className="text-xs text-subtle">{overrides.length} overrides stored</span>
          </div>
        </form>
      </div>
    </div>
  );
}
