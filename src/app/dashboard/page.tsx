"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  ChevronRight,
  Code2,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { StudentShell } from "@/components/layout/app-sidebar";
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
  getNextIncompleteLesson,
  isCourseLessonsComplete,
} from "@/lib/progress";
import { getAllVideoProgress, type VideoProgressRecord } from "@/lib/video-progress";
import { CERT_PASS_SCORE, isCertificatePaid, isCertPassingScore } from "@/lib/certificates";
import { cn } from "@/lib/utils";

// Student dashboard — StudentShell provides fixed left sidebar + main column
export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [videos, setVideos] = useState<VideoProgressRecord[]>([]);
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
        setVideos(getAllVideoProgress());
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

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const list = useMemo(() => (Array.isArray(enrollments) ? enrollments : []), [enrollments]);
  const certificates = list.filter((e) => e.certificateId);
  const avgProgress =
    list.length === 0
      ? 0
      : Math.round(
          list.reduce((sum, e) => {
            const c = getCourse(e.courseSlug);
            return sum + progressPercent(e, c ? courseLessonCount(c) : 1);
          }, 0) / list.length,
        );
  const lessonsDone = list.reduce((n, e) => n + e.completedLessons.length, 0);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading…</div>
    );
  }
  if (!student) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Redirecting…</div>
    );
  }

  return (
    <StudentShell
      student={student}
      onSignOut={handleSignOut}
      title="My learning"
      subtitle="Progress, courses, and certificates"
      actions={
        <Link
          href="/courses"
          className="hidden h-9 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-2 sm:inline-flex"
        >
          Browse courses
        </Link>
      }
    >
      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Hi, {student.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted">Pick up where you left off or open the playground.</p>
      </div>

      {(() => {
        const resume = list
          .map((e) => {
            const course = getCourse(e.courseSlug);
            if (!course) return null;
            const next = getNextIncompleteLesson(course, e);
            if (!next) return null;
            const total = courseLessonCount(course);
            const pct = progressPercent(e, total);
            return { e, course, next, pct };
          })
          .filter(Boolean)
          .sort((a, b) => (b?.pct || 0) - (a?.pct || 0))[0] as
          | {
              e: Enrollment;
              course: NonNullable<ReturnType<typeof getCourse>>;
              next: NonNullable<ReturnType<typeof getNextIncompleteLesson>>;
              pct: number;
            }
          | undefined;

        if (!resume) return null;
        return (
          <Link
            href={`/courses/${resume.course.slug}?lesson=${resume.next.lesson.id}`}
            className="mb-8 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 transition-colors hover:border-primary/50 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-wider text-primary uppercase">
                Continue learning
              </p>
              <p className="mt-1 font-display text-lg font-semibold">{resume.course.title}</p>
              <p className="mt-0.5 text-sm text-muted">
                Next: {resume.next.lesson.title}
                <span className="text-subtle"> · Module {resume.next.moduleIndex + 1}</span>
              </p>
              <div className="mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${resume.pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted">{resume.pct}% complete</p>
            </div>
            <span className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-fg">
              Resume →
            </span>
          </Link>
        );
      })()}

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/playground"
          className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/40"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Code2 className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Practice playground</span>
            <span className="block text-xs text-muted">HTML, JS, TS, Python — run code live</span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted" />
        </Link>
        <Link
          href="/courses"
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-2"
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-surface-2 text-primary">
            <BookOpen className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Browse courses</span>
            <span className="block text-xs text-muted">Enroll and unlock modules in order</span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-muted" />
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Enrolled", value: list.length, icon: BookOpen },
          { label: "Avg progress", value: `${avgProgress}%`, icon: TrendingUp },
          { label: "Lessons done", value: lessonsDone, icon: PlayCircle },
          { label: "Certificates", value: certificates.length, icon: Award },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 text-muted">
              <s.icon className="size-3.5" />
              <span className="text-[11px] font-medium tracking-wide uppercase">{s.label}</span>
            </div>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Your courses</h2>
          {list.length > 0 ? <span className="text-xs text-muted">{list.length} enrolled</span> : null}
        </div>

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-10 text-center">
            <p className="text-sm font-medium">No courses yet</p>
            <p className="mt-1 text-sm text-muted">Enroll free and start the first module.</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((e) => {
              const course = getCourse(e.courseSlug);
              if (!course) return null;
              const total = courseLessonCount(course);
              const pct = progressPercent(e, total);
              const next = getNextIncompleteLesson(course, e);
              const modulesDone = countUnlockedModules(course, e);
              const modulesTotal = course.modules.length;
              const lessonsComplete = isCourseLessonsComplete(course, e);
              const quizOk = isCertPassingScore(e.quizScore);
              const paid = isCertificatePaid(student.id, e.courseSlug, e.certificateId);

              return (
                <li key={e.courseSlug} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div
                      className={cn(
                        "h-16 w-full shrink-0 overflow-hidden rounded-lg bg-gradient-to-br sm:h-20 sm:w-28",
                        course.accent,
                      )}
                    >
                      {course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.thumbnail} alt="" className="size-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/courses/${course.slug}`}
                            className="font-display text-base font-semibold hover:text-primary"
                          >
                            {course.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted">
                            {modulesDone}/{modulesTotal} modules · {e.completedLessons.length}/{total} lessons
                            {e.quizScore != null ? ` · Quiz ${e.quizScore}%` : ""}
                          </p>
                        </div>
                        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold tabular-nums">
                          {pct}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {next ? (
                          <Link
                            href={`/courses/${course.slug}?lesson=${next.lesson.id}`}
                            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-fg"
                          >
                            Continue: {next.lesson.title}
                          </Link>
                        ) : (
                          <Link
                            href={`/courses/${course.slug}`}
                            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-fg"
                          >
                            Open course
                          </Link>
                        )}
                        {lessonsComplete && !quizOk ? (
                          <span className="inline-flex h-9 items-center rounded-md border border-border px-3 text-xs text-muted">
                            Pass quiz (≥{CERT_PASS_SCORE}%) for certificate
                          </span>
                        ) : null}
                        {e.certificateId && quizOk ? (
                          paid ? (
                            <Link
                              href={`/certificates?id=${e.certificateId}`}
                              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-xs font-semibold"
                            >
                              Download certificate
                            </Link>
                          ) : (
                            <Link
                              href={`/courses/${course.slug}#certificate`}
                              className="inline-flex h-9 items-center rounded-md border border-orange/40 bg-orange/10 px-3 text-xs font-semibold text-orange"
                            >
                              Unlock certificate
                            </Link>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {certificates.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Certificates</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {certificates.map((e) => {
              const course = getCourse(e.courseSlug);
              const paid = isCertificatePaid(student.id, e.courseSlug, e.certificateId);
              return (
                <li
                  key={e.certificateId}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
                >
                  <Award className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course?.title || e.courseSlug}</p>
                    <p className="truncate text-xs text-muted">{e.certificateId}</p>
                  </div>
                  <Link
                    href={
                      paid
                        ? `/certificates?id=${e.certificateId}`
                        : `/courses/${e.courseSlug}#certificate`
                    }
                    className="shrink-0 text-xs font-semibold text-primary hover:underline"
                  >
                    {paid ? "View" : "Pay & download"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="pb-4">
        <h2 className="mb-3 font-display text-lg font-semibold">Recommended</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses
            .filter((c) => !list.some((e) => e.courseSlug === c.slug))
            .slice(0, 3)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="rounded-xl border border-border bg-surface p-3 transition-colors hover:border-primary/30"
              >
                <div className={cn("mb-2 h-14 overflow-hidden rounded-lg bg-gradient-to-br", c.accent)}>
                  {c.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnail} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{c.tagline}</p>
              </Link>
            ))}
        </div>
      </section>
    </StudentShell>
  );
}
