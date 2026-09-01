"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { fetchLessonComments, postLessonComment, type LessonComment } from "@/lib/comments";

export function LessonComments({
  courseSlug,
  lessonId,
}: {
  courseSlug: string;
  lessonId: string;
}) {
  const [items, setItems] = useState<LessonComment[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchLessonComments(courseSlug, lessonId);
      if (!cancelled) setItems(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const row = await postLessonComment(courseSlug, lessonId, body);
      setItems((prev) => [...prev, { ...row, author_name: "You" }]);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquare className="size-4 text-primary" /> Q&A
      </h3>
      <ul className="mt-3 max-h-64 space-y-3 overflow-y-auto">
        {items.length === 0 ? (
          <li className="text-xs text-muted">No questions yet. Ask the first one.</li>
        ) : (
          items.map((c) => (
            <li key={c.id} className="rounded-lg bg-bg px-3 py-2">
              <p className="text-xs font-semibold">{c.author_name || "Student"}</p>
              <p className="mt-0.5 text-sm whitespace-pre-wrap">{c.body}</p>
              <p className="mt-1 text-[10px] text-subtle">{new Date(c.created_at).toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={submit} className="mt-3 space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Ask a question or share a tip…"
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="h-9 rounded-md bg-primary px-3 text-xs font-semibold text-primary-fg disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post comment"}
        </button>
      </form>
    </section>
  );
}
