"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { courses, catalogStats } from "@/lib/courses/catalog";
import type { CourseLevel } from "@/lib/courses/types";

const levels: Array<"All" | CourseLevel> = ["All", "Beginner", "Intermediate"];

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-12 text-sm text-muted sm:px-6">Loading catalog…</main>
      }
    >
      <CoursesCatalog />
    </Suspense>
  );
}

function CoursesCatalog() {
  const searchParams = useSearchParams();
  const [level, setLevel] = useState<"All" | CourseLevel>("All");
  const [q, setQ] = useState("");
  const stats = catalogStats();

  // Sync from header search: /courses?q=python
  useEffect(() => {
    const fromUrl = searchParams.get("q") || "";
    setQ(fromUrl);
  }, [searchParams]);

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase();
    return courses.filter((c) => {
      if (level !== "All" && c.level !== level) return false;
      if (!query) return true;
      const hay = [c.title, c.tagline, c.description, c.slug, c.level, ...c.outcomes]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [level, q]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="animate-slide-up">
        <p className="text-xs font-semibold tracking-widest text-orange uppercase">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          All courses
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          {stats.courseCount} courses · {stats.lessonCount} lessons · ~{stats.hours} hours. Video,
          reading, practice, and certificates.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search courses</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by topic, title, skill…"
            className="h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
          {levels.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              aria-pressed={level === item}
              className={`h-11 rounded-md px-4 text-sm font-medium transition-colors ${
                level === item
                  ? "bg-primary text-primary-fg"
                  : "border border-border text-fg hover:bg-surface-2"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        {visible.length} course{visible.length === 1 ? "" : "s"}
        {q.trim() ? ` matching “${q.trim()}”` : ""}
      </p>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted">
          No courses match. Try another keyword or clear filters.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </main>
  );
}
