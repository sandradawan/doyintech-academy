"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Award, BookOpen, Lock, Unlock } from "lucide-react";
import { getCourse, courses } from "@/lib/courses/catalog";
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
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getStudent();
        if (cancelled) return;
        if (!s) {
          router.replace("/login?next=/dashboard");
          setReady(true);
          return;
        }
        setStudent(s);
        const list = await getEnrollments();
        if (cancelled) return;
        setEnrollments(Array.isArray(list) ? list : []);
        setReady(true);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
        setEnrollments([]);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-muted sm:px-6">Loading dashboard…</main>
    );
  }

  if (!student) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-muted sm:px-6">Redirecting to login…</main>
    );
  }

  const list = Array.isArray(enrollments) ? enrollments : [];
  const certificates = list.filter((e) => e.certificateId);

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
          onClick={async () => {
            await signOut();
            router.push("/");
            router.refresh();
          }}
          className="h-10 rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-2"
        >
          Sign out
        </button>
      </div>

      {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">Your courses</h2>
        {list.length === 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">You are not enrolled in any course yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {list.map((e) => {
              const course = getCourse(e.courseSlug);
              if (!course) return null;
              const total = courseLessonCount(course);
              const pct = progressPercent(e, total);
              const next = getNextIncompleteLesson(course, e);
              const unlocked = countUnlockedModules(course, e);
              const done = isCourseLessonsComplete(course, e);
              const activeIdx = getActiveModuleIndex(course, e);
              return (
                <li key={e.courseSlug} className="rounded-xl border border-border bg-surface p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-display text-lg font-medium">{course.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {pct}% complete · {unlocked}/{course.modules.length} modules unlocked
                        {done ? " · Lessons complete" : ""}
                      </p>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg"
                    >
                      {next ? "Continue" : done ? "Review / quiz" : "Open course"}
                    </Link>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  {next ? (
                    <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <Unlock className="size-3.5" /> Next: {next.lesson.title}
                      {activeIdx >= 0 ? ` · Module ${activeIdx + 1}` : ""}
                    </p>
                  ) : done ? (
                    <p className="mt-3 flex items-center gap-2 text-xs text-cyan">
                      <BookOpen className="size-3.5" /> Ready for the end-of-course quiz
                    </p>
                  ) : (
                    <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <Lock className="size-3.5" /> Keep completing lessons to unlock modules
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Certificates</h2>
        {certificates.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Pass a course quiz at 70% or higher to earn a certificate.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {certificates.map((e) => (
              <li
                key={e.certificateId}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm"
              >
                <Award className="size-4 text-orange" />
                <span className="font-medium">{getCourse(e.courseSlug)?.title ?? e.courseSlug}</span>
                <span className="text-muted">· {e.certificateId}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Explore more</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {courses.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              href={`/courses/${c.slug}`}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-2"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
