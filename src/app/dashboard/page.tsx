"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Award, BookOpen, Lock, Unlock } from "lucide-react";
import { getCourse } from "@/lib/courses/catalog";
import {
  getEnrollments,
  getStudent,
  progressPercent,
  signOut,
  type Enrollment,
  type Student,
} from "@/lib/auth";
import { courseLessonCount } from "@/lib/courses/types";
import {
  countUnlockedModules,
  getActiveModuleIndex,
  getNextIncompleteLesson,
  isCourseLessonsComplete,
} from "@/lib/progress";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getStudent();
    setStudent(s);
    setEnrollments(getEnrollments());
    setReady(true);
    if (!s) router.replace("/login?next=/dashboard");
  }, [router]);

  if (!ready || !student) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-muted sm:px-6">Loading dashboard…</main>
    );
  }

  const certificates = enrollments.filter((e) => e.certificateId);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-widest text-cyan uppercase">Dashboard</p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
            Hello, {student.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-muted">{student.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-2"
        >
          Sign out
        </button>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-medium">Your courses</h2>
          <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
            Browse catalog
          </Link>
        </div>
        {enrollments.length === 0 ? (
          <div className="mt-6 rounded-xl border border-border bg-surface p-8 text-center">
            <BookOpen className="mx-auto size-8 text-cyan" />
            <p className="mt-4 text-sm text-muted">You have not enrolled in a course yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
            >
              Find a course
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {enrollments.map((e) => {
              const course = getCourse(e.courseSlug);
              if (!course) return null;
              const total = courseLessonCount(course);
              const pct = progressPercent(e.courseSlug, total);
              const activeIndex = getActiveModuleIndex(course, e);
              const unlockedCount = countUnlockedModules(course, e);
              const next = getNextIncompleteLesson(course, e);
              const readyForQuiz = isCourseLessonsComplete(course, e);

              return (
                <div
                  key={e.courseSlug}
                  className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40"
                >
                  <p className="text-xs text-subtle">{course.level}</p>
                  <h3 className="mt-1 font-display text-lg font-medium">{course.title}</h3>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-cyan" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {e.completedLessons.length} / {total} lessons · {pct}%
                    {e.certificateId ? " · Certified" : ""}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-subtle">
                    <span className="inline-flex items-center gap-1">
                      <Unlock className="size-3 text-primary" />
                      Module {activeIndex + 1} of {course.modules.length}
                    </span>
                    <span>·</span>
                    <span>
                      {unlockedCount} unlocked
                      {unlockedCount < course.modules.length ? (
                        <span className="ml-1 inline-flex items-center gap-0.5">
                          <Lock className="size-3" />
                          {course.modules.length - unlockedCount} locked
                        </span>
                      ) : null}
                    </span>
                  </p>
                  {next ? (
                    <p className="mt-2 text-xs text-muted">Next: {next.lesson.title}</p>
                  ) : readyForQuiz && !e.certificateId ? (
                    <p className="mt-2 text-xs text-cyan">All modules done — take the final quiz</p>
                  ) : null}
                  <Link
                    href={`/courses/${e.courseSlug}${next ? `#module-${next.moduleIndex}` : readyForQuiz ? "#final-quiz" : ""}`}
                    className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
                  >
                    {next ? "Continue learning" : readyForQuiz && !e.certificateId ? "Take quiz" : "Open course"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Certificates</h2>
        {certificates.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Complete every module in order, then pass the quiz at 70% or higher.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {certificates.map((e) => {
              const course = getCourse(e.courseSlug);
              return (
                <li
                  key={e.certificateId}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-4"
                >
                  <Award className="size-5 text-cyan" />
                  <div>
                    <p className="font-medium">{course?.title}</p>
                    <p className="font-mono text-xs text-subtle">{e.certificateId}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
