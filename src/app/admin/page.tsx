"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { courses } from "@/lib/courses/catalog";
import {
  ADMIN_PIN,
  adminLogin,
  adminLogout,
  getOverrides,
  getWaitlist,
  isAdmin,
  saveOverride,
  type WaitlistEntry,
} from "@/lib/admin";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [selectedSlug, setSelectedSlug] = useState(courses[0]?.slug || "");
  const [lessonId, setLessonId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [body, setBody] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [overrideCount, setOverrideCount] = useState(0);

  useEffect(() => {
    setAuthed(isAdmin());
    setWaitlist(getWaitlist());
    setOverrideCount(getOverrides().length);
  }, []);

  const course = courses.find((c) => c.slug === selectedSlug);
  const lessons = course?.modules.flatMap((m) => m.lessons) || [];

  function onLogin(e: FormEvent) {
    e.preventDefault();
    if (adminLogin(pin)) {
      setAuthed(true);
      setError("");
      setWaitlist(getWaitlist());
      setOverrideCount(getOverrides().length);
    } else {
      setError("Incorrect PIN.");
    }
  }

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
    setOverrideCount(getOverrides().length);
    setSavedMsg("Saved on this device.");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <p className="text-xs font-medium tracking-widest text-cyan uppercase">Admin</p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Faculty access</h1>
        <p className="mt-3 text-sm text-muted">
          Demo PIN: <span className="font-mono text-fg">{ADMIN_PIN}</span>
        </p>
        <form onSubmit={onLogin} className="mt-8 space-y-4">
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Admin PIN" />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button type="submit" className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-fg">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-cyan uppercase">Admin CMS</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Content desk</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/courses" className="h-10 rounded-md border border-border px-4 text-sm font-medium leading-10">View site</Link>
          <button type="button" onClick={() => { adminLogout(); setAuthed(false); }} className="h-10 rounded-md border border-border px-4 text-sm font-medium">Log out</button>
        </div>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <form onSubmit={saveLesson} className="space-y-4">
          <h2 className="font-display text-xl font-medium">Edit a lesson</h2>
          <select value={selectedSlug} onChange={(e) => { setSelectedSlug(e.target.value); setLessonId(""); }} className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm">
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
          <select value={lessonId} onChange={(e) => loadLesson(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm">
            <option value="">Select lesson…</option>
            {lessons.map((l) => <option key={l.id} value={l.id}>{l.title} ({l.kind})</option>)}
          </select>
          {lessonId ? (
            <>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm" placeholder="Title" />
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm" placeholder="Summary" />
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm" placeholder="Video URL" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm" placeholder="Lesson body" />
              <button type="submit" className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-fg">Save lesson</button>
              {savedMsg ? <p className="text-sm text-cyan">{savedMsg}</p> : null}
            </>
          ) : null}
          <p className="text-xs text-subtle">Overrides saved: {overrideCount}</p>
        </form>
        <section>
          <h2 className="font-display text-xl font-medium">Waitlist ({waitlist.length})</h2>
          {waitlist.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No signups yet on this browser.</p>
          ) : (
            <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto">
              {waitlist.slice().reverse().map((entry) => (
                <li key={entry.email + entry.createdAt} className="rounded-lg border border-border bg-surface px-3 py-3 text-sm">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-muted">{entry.email}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
