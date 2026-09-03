"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, GraduationCap, Search, Users } from "lucide-react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import { fetchEnrollmentMap } from "@/lib/admin-crm";
import { PaginationBar, usePagedItems } from "@/components/admin/pagination";
import { cn } from "@/lib/utils";
import { useRealtimeSync } from "@/lib/realtime";
import { LiveBadge } from "@/components/admin/live-badge";

type Row = { courseSlug: string; userId: string; studentName: string; studentEmail: string };

const PAGE_SIZE = 12;

export default function AdminEnrollmentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      setRows(await fetchEnrollmentMap());
      setError("");
      setLive(true);
      setLastSync(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load enrollments");
      setLive(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useRealtimeSync(["enrollments", "profiles"], () => {
    void load(true);
  });

  const byCourse = useMemo(() => {
    return courses
      .map((c) => {
        const enrolled = rows.filter((r) => r.courseSlug === c.slug);
        return { course: c, count: enrolled.length, students: enrolled, lessons: courseLessonCount(c) };
      })
      .sort((a, b) => b.count - a.count);
  }, [rows]);

  const totalEnrollments = rows.length;
  const coursesWithStudents = byCourse.filter((c) => c.count > 0).length;
  const uniqueStudents = useMemo(() => new Set(rows.map((r) => r.userId)).size, [rows]);
  const topCourse = byCourse[0];

  const filteredStudents = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (selectedSlug !== "all" && r.courseSlug !== selectedSlug) return false;
      if (!query) return true;
      return (
        r.studentName.toLowerCase().includes(query) ||
        r.studentEmail.toLowerCase().includes(query) ||
        r.courseSlug.toLowerCase().includes(query)
      );
    });
  }, [rows, q, selectedSlug]);

  useEffect(() => {
    setPage(1);
  }, [q, selectedSlug]);

  const { slice, totalPages, safePage } = usePagedItems(filteredStudents, PAGE_SIZE, page);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Enrollments</h1>
          <p className="mt-1 text-sm text-muted">Realtime Supabase sync · course demand and student roster</p>
        </div>
        <LiveBadge live={live && !error} lastSync={lastSync} />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat icon={GraduationCap} label="Total enrollments" value={loading ? "—" : String(totalEnrollments)} hint="All course seats" />
        <MiniStat icon={Users} label="Unique students" value={loading ? "—" : String(uniqueStudents)} hint="Distinct learner accounts" />
        <MiniStat icon={BookOpen} label="Courses with learners" value={loading ? "—" : String(coursesWithStudents)} hint={`of ${courses.length} in catalog`} />
        <MiniStat icon={GraduationCap} label="Top course" value={loading ? "—" : String(topCourse?.count ?? 0)} hint={topCourse?.course.title || "—"} />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">By course</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {byCourse.map(({ course, count, lessons }) => {
            const active = selectedSlug === course.slug;
            const max = Math.max(topCourse?.count || 1, 1);
            const pct = Math.round((count / max) * 100);
            return (
              <button key={course.slug} type="button" onClick={() => setSelectedSlug(active ? "all" : course.slug)}
                className={cn("rounded-xl border bg-surface p-4 text-left transition-colors",
                  active ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold">{course.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{course.level} · {lessons} lessons</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-bold tabular-nums text-primary">{count}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1.5 text-[11px] text-subtle">
                  {count === 0 ? "No enrollments yet" : `${count} student${count === 1 ? "" : "s"} enrolled`}
                  {active ? " · filter on" : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Student roster</h2>
            <p className="text-xs text-muted">
              {selectedSlug === "all" ? "All enrollments" : courses.find((c) => c.slug === selectedSlug)?.title || selectedSlug}
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…"
              className="h-10 w-full rounded-md border border-border bg-bg pr-3 pl-10 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">Loading enrollments…</p>
        ) : filteredStudents.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No enrollments match this filter.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Course</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {slice.map((r) => {
                    const course = courses.find((c) => c.slug === r.courseSlug);
                    return (
                      <tr key={`${r.userId}-${r.courseSlug}`} className="hover:bg-surface-2/40">
                        <td className="px-4 py-3 font-medium">{r.studentName}</td>
                        <td className="px-4 py-3 text-muted">{r.studentEmail || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium">{course?.title || r.courseSlug}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <PaginationBar page={safePage} totalPages={totalPages} total={filteredStudents.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 truncate text-xs text-subtle">{hint}</p>
    </div>
  );
}
