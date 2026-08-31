"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { courses } from "@/lib/courses/catalog";
import type { CourseLevel } from "@/lib/courses/types";

const filters: Array<"All" | CourseLevel> = ["All", "Beginner", "Intermediate"];

export default function CoursesPage() {
  const [level, setLevel] = useState<"All" | CourseLevel>("All");
  const visible = useMemo(
    () => (level === "All" ? courses : courses.filter((c) => c.level === level)),
    [level],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="animate-slide-up">
        <p className="text-xs font-semibold tracking-widest text-orange uppercase">Catalog</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          All courses
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
          Structured paths with video, reading, exercises, and a final quiz that can issue a
          certificate.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        {filters.map((item) => (
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
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </main>
  );
}
