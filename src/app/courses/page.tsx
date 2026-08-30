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
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-cyan uppercase">Catalog</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Courses</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        Six complete paths. Each one mixes video, writing, and exercises, and ends in a quiz that
        can issue a certificate.
      </p>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by level">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLevel(item)}
            aria-pressed={level === item}
            className={`h-9 rounded-md px-3 text-sm font-medium ${
              level === item
                ? "bg-primary text-primary-fg"
                : "border border-border text-fg hover:bg-surface-2"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </main>
  );
}
