"use client";

import { useEffect, useState } from "react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import { fetchEnrollmentMap } from "@/lib/admin-crm";

export default function AdminEnrollmentsPage() {
  const [rows, setRows] = useState<
    { courseSlug: string; userId: string; studentName: string; studentEmail: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setRows(await fetchEnrollmentMap());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byCourse = courses.map((c) => {
    const enrolled = rows.filter((r) => r.courseSlug === c.slug);
    return { course: c, count: enrolled.length, students: enrolled, lessons: courseLessonCount(c) };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Enrollments</h1>
        <p className="mt-1 text-sm text-muted">Live from Supabase enrollments joined to profiles.</p>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Loading…</p> : null}
      <div className="grid gap-4">
        {byCourse.map(({ course, count, students: list, lessons }) => (
          <section key={course.slug} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold">{course.title}</h2>
                <p className="text-xs text-muted">{lessons} lessons · {course.level}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary tabular-nums">
                {count} enrolled
              </span>
            </div>
            {list.length === 0 ? (
              <p className="mt-4 text-sm text-subtle">No enrollments for this course yet.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {list.map((s) => (
                  <li key={s.userId} className="rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium" title={s.studentEmail}>
                    {s.studentName}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
