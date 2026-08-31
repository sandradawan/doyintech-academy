"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  ChevronRight,
  Clapperboard,
  Lock,
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
  isModuleComplete,
  moduleProgress,
} from "@/lib/progress";
import { getAllVideoProgress, type VideoProgressRecord } from "@/lib/video-progress";
import { CERT_PASS_SCORE, isCertificatePaid, isCertPassingScore } from "@/lib/certificates";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [videos, setVideos] = useState<VideoProgressRecord[]>([]);
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
  const videosDone = videos.filter((v) => v.completed).length;
  const avgVideo =
    videos.length === 0
      ? 0
      : Math.round(videos.reduce((s, v) => s + v.percent, 0) / videos.length);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">Loading your learning…</div>
    );
  }
  if (!student) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">Redirecting to sign in…</div>
    );
  }

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
            <p className="truncate text-sm font-medium text-fg">Progress dashboard</p>
            <p className="truncate text-xs text-muted">Lessons, modules, videos, and certificates</p>
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
              Track every module, resume videos, and finish assessments (≥{CERT_PASS_SCORE}%) for certificates.
            </p>
          </div>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Enrolled", value: String(list.length), icon: BookOpen },
              { label: "Lessons done", value: String(lessonsDone), icon: TrendingUp },
              { label: "Video watch avg", value: `${avgVideo}%`, icon: Clapperboard },
              { label: "Certificates", value: String(certificates.length), icon: Award },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "animate-slide-up rounded-xl border border-border bg-surface p-5 shadow-sm",
                  `stagger-${Math.min(i + 1, 4)}`,
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">{stat.label}</p>
                  <stat.icon className="size-4 text-primary" aria-hidden />
                </div>
                <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-fg">Overall learning progress</p>
              <p className="text-sm tabular-nums text-muted">{avgProgress}% avg across enrollments</p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-surface-2">
              <div className="progress-bar h-full rounded-full bg-primary" style={{ width: `${avgProgress}%` }} />
            </div>
            <p className="mt-2 text-xs text-subtle">
              {videosDone} video{videosDone === 1 ? "" : "s"} marked complete in this browser
            </p>
          </div>

          <section className="mt-10">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-xl font-semibold tracking-tight">Course progress</h2>
              <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
                Add a course
              </Link>
            </div>

            {list.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                <p className="text-sm text-muted">No enrollments yet. Start a path to track modules here.</p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg"
                >
                  Browse courses
                </Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {list.map((e) => {
                  const course = getCourse(e.courseSlug);
                  if (!course) return null;
                  const total = courseLessonCount(course);
                  const pct = progressPercent(e, total);
                  const next = getNextIncompleteLesson(course, e);
                  const unlocked = countUnlockedModules(course, e);
                  const modulesDone = course.modules.filter((m) => isModuleComplete(m, e)).length;
                  const readyQuiz = isCourseLessonsComplete(course, e);
                  const certReady = isCertPassingScore(e.quizScore) && e.certificateId;
                  const paid =
                    !!certReady && isCertificatePaid(student.id, e.courseSlug, e.certificateId);

                  return (
                    <li
                      key={e.courseSlug}
                      className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
                    >
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                        <div
                          className={`relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-gradient-to-br sm:h-20 sm:w-32 ${course.accent}`}
                        >
                          {course.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={course.thumbnail} alt="" className="size-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-display text-lg font-semibold">{course.title}</h3>
                              <p className="text-xs text-muted">
                                {e.completedLessons.length}/{total} lessons · {modulesDone}/
                                {course.modules.length} modules · {unlocked} unlocked
                              </p>
                            </div>
                            <span className="text-sm font-semibold tabular-nums text-primary">{pct}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="progress-bar h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {course.modules.map((mod, mi) => {
                              const mp = moduleProgress(mod, e);
                              return (
                                <div key={mod.id} className="rounded-md bg-bg px-2.5 py-2">
                                  <div className="flex items-center justify-between gap-2 text-[11px]">
                                    <span className="truncate font-medium text-fg">
                                      M{mi + 1}. {mod.title}
                                    </span>
                                    <span className="tabular-nums text-muted">
                                      {mp.done}/{mp.total}
                                    </span>
                                  </div>
                                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                                    <div
                                      className="h-full rounded-full bg-cyan"
                                      style={{ width: `${mp.percent}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {next ? (
                              <Link
                                href={`/courses/${e.courseSlug}`}
                                className="inline-flex h-10 items-center gap-1 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg"
                              >
                                <PlayCircle className="size-4" /> Continue: {next.lesson.title}
                              </Link>
                            ) : readyQuiz && !certReady ? (
                              <Link
                                href={`/courses/${e.courseSlug}#final-quiz`}
                                className="inline-flex h-10 items-center rounded-md bg-orange px-3 text-sm font-semibold text-white"
                              >
                                Take final assessment
                              </Link>
                            ) : certReady ? (
                              <Link
                                href={`/courses/${e.courseSlug}#certificate`}
                                className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-3 text-sm font-semibold"
                              >
                                {paid ? (
                                  <>
                                    <Award className="size-4 text-success" /> Download certificate
                                  </>
                                ) : (
                                  <>
                                    <Lock className="size-4" /> Pay to download certificate
                                  </>
                                )}
                              </Link>
                            ) : (
                              <Link
                                href={`/courses/${e.courseSlug}`}
                                className="inline-flex h-10 items-center gap-1 text-sm font-medium text-primary hover:underline"
                              >
                                Open course <ChevronRight className="size-4" />
                              </Link>
                            )}
                            {typeof e.quizScore === "number" ? (
                              <span className="text-xs text-muted">Quiz best: {e.quizScore}%</span>
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

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold tracking-tight">Video progress</h2>
            <p className="mt-1 text-sm text-muted">Saved in this browser (resume position + % watched).</p>
            {videos.length === 0 ? (
              <p className="mt-4 text-sm text-subtle">Watch a lesson video to start tracking.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
                {videos.slice(0, 12).map((v) => (
                  <li key={v.videoId} className="flex items-center gap-3 px-4 py-3">
                    <Clapperboard className="size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{v.videoId}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${v.percent}%` }} />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {v.completed ? "Done" : `${v.percent}%`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-12 pb-8">
            <h2 className="font-display text-xl font-semibold tracking-tight">Recommended</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((c) => !list.some((e) => e.courseSlug === c.slug))
                .slice(0, 3)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="card-lift rounded-xl border border-border bg-surface p-4"
                  >
                    <div className={`relative mb-3 h-16 overflow-hidden rounded-lg bg-gradient-to-br ${c.accent}`}>
                      {c.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.thumbnail} alt="" className="size-full object-cover" />
                      ) : null}
                    </div>
                    <p className="font-display text-sm font-semibold">{c.title}</p>
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
