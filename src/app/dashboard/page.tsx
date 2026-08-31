"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  ChevronRight,
  Menu,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
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

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

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

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        Loading your learning…
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        Redirecting to sign in…
      </div>
    );
  }

  const list = Array.isArray(enrollments) ? enrollments : [];
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

  return (
    <div className="min-h-dvh bg-bg">
      <AppSidebar
        student={student}
        onSignOut={handleSignOut}
        mobileOpen={mobileNav}
        onClose={() => setMobileNav(false)}
      />

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md border border-border md:hidden"
            aria-label="Open sidebar"
            onClick={() => setMobileNav(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">My learning</p>
            <p className="truncate text-xs text-muted">Pick up where you left off</p>
          </div>
          <Link
            href="/courses"
            className="hidden h-10 items-center rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-2 sm:inline-flex"
          >
            Browse
          </Link>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="animate-slide-up">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back, {student.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Track progress, unlock modules, and earn certificates.
            </p>
          </div>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Enrolled courses", value: String(list.length), icon: BookOpen },
              { label: "Avg. progress", value: `${avgProgress}%`, icon: TrendingUp },
              { label: "Certificates", value: String(certificates.length), icon: Award },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-slide-up stagger-${i + 1} rounded-xl border border-border bg-surface p-5 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">
                    {stat.label}
                  </p>
                  <stat.icon className="size-4 text-primary" aria-hidden />
                </div>
                <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">Continue learning</h2>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                Explore all
              </Link>
            </div>

            {list.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                <PlayCircle className="mx-auto size-10 text-subtle" aria-hidden />
                <p className="mt-3 text-sm font-medium text-fg">No courses yet</p>
                <p className="mt-1 text-sm text-muted">
                  Enroll in a path to start unlocking modules lesson by lesson.
                </p>
                <Link
                  href="/courses"
                  className="mt-5 inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-fg"
                >
                  Browse courses
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {list.map((e, i) => {
                  const course = getCourse(e.courseSlug);
                  if (!course) return null;
                  const total = courseLessonCount(course);
                  const pct = progressPercent(e, total);
                  const next = getNextIncompleteLesson(course, e);
                  const unlocked = countUnlockedModules(course, e);
                  const done = isCourseLessonsComplete(course, e);
                  return (
                    <li
                      key={e.courseSlug}
                      className={`card-lift animate-slide-up stagger-${Math.min(i + 1, 4)} rounded-xl border border-border bg-surface p-4 sm:p-5`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div
                          className={`h-20 w-full shrink-0 rounded-lg bg-gradient-to-br sm:h-16 sm:w-28 ${course.accent}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-base font-semibold">{course.title}</p>
                              <p className="mt-0.5 text-xs text-muted">
                                {unlocked}/{course.modules.length} modules open · {pct}% complete
                              </p>
                            </div>
                            <Link
                              href={`/courses/${course.slug}`}
                              className="inline-flex h-10 items-center gap-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg hover:bg-primary/90"
                            >
                              {next ? "Continue" : done ? "Quiz" : "Open"}
                              <ChevronRight className="size-4" aria-hidden />
                            </Link>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="progress-bar h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {next ? (
                            <p className="mt-2 text-xs text-muted">Next: {next.lesson.title}</p>
                          ) : done ? (
                            <p className="mt-2 text-xs text-success">Ready for certification quiz</p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {certificates.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Your certificates</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {certificates.map((e) => (
                  <li
                    key={e.certificateId}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <Award className="size-5 text-orange" aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {getCourse(e.courseSlug)?.title ?? e.courseSlug}
                      </p>
                      <p className="text-xs text-muted">{e.certificateId}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Recommended for you</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {courses.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="card-lift rounded-xl border border-border bg-surface p-4"
                >
                  <div className={`mb-3 h-16 rounded-lg bg-gradient-to-br ${c.accent}`} />
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{c.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
