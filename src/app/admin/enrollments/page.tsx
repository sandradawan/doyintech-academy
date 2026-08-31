"use client";

import { useEffect, useState } from "react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import { getCrmStudents, seedDemoStudentsIfEmpty, type CrmStudent } from "@/lib/admin-crm";

export default function AdminEnrollmentsPage() {
  const [students, setStudents] = useState<CrmStudent[]>([]);

  useEffect(() => {
    seedDemoStudentsIfEmpty();
    setStudents(getCrmStudents());
  }, []);

  const byCourse = courses.map((c) => {
    const enrolled = students.filter((s) => s.enrolledCourses.includes(c.slug));
    return {
      course: c,
      count: enrolled.length,
      students: enrolled,
      lessons: courseLessonCount(c),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Enrollments</h1>
        <p className="mt-1 text-sm text-muted">
          Course × student map from the CRM student directory.
        </p>
      </div>

      <div className="grid gap-4">
        {byCourse.map(({ course, count, students: list, lessons }) => (
          <section key={course.slug} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold">{course.title}</h2>
                <p className="text-xs text-muted">
                  {lessons} lessons · {course.level} · {course.hours}h
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary tabular-nums">
                {count} enrolled
              </span>
            </div>
            {list.length === 0 ? (
              <p className="mt-4 text-sm text-subtle">No CRM students enrolled in this path yet.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {list.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium"
                  >
                    {s.name}
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
