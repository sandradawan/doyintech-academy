"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clapperboard,
  Clock,
  Code2,
  ListChecks,
  Lock,
  Unlock,
} from "lucide-react";
import { getCourse } from "@/lib/courses/catalog";
import type { Lesson, LessonKind } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";
import {
  enrollInCourse,
  getEnrollment,
  getStudent,
  markLessonComplete,
  type Enrollment,
  type Student,
} from "@/lib/auth";
import { QuizPanel } from "@/components/courses/quiz-panel";
import { LessonContentPanel } from "@/components/courses/lesson-content-panel";
import { VideoPlayer } from "@/components/media/video-player";
import {
  getNextIncompleteLesson,
  isCourseLessonsComplete,
  isModuleComplete,
  isModuleUnlocked,
  moduleProgress,
} from "@/lib/progress";
import { CERT_PASS_SCORE } from "@/lib/certificates";
import { youtubeThumb } from "@/lib/video-progress";
import { cn } from "@/lib/utils";

const kindIcon: Record<LessonKind, typeof Clapperboard> = {
  video: Clapperboard,
  text: BookOpen,
  interactive: Code2,
  quiz: ListChecks,
};
const kindLabel: Record<LessonKind, string> = {
  video: "Video",
  text: "Reading",
  interactive: "Exercise",
  quiz: "Quiz",
};

const LESSON_VIDEO: Record<string, string> = {
  "wf-1-1": "UB1O30fX-d8",
  "wf-3-1": "1Rs2ND1ryYc",
  "wf-4-1": "0eWRW09YTCA",
  "js-1-1": "W6NZfCO5SIk",
  "js-2-1": "W6NZfCO5SIk",
  "js-3-1": "PoRJizdjiFE",
  "re-1-1": "Tn6-PIqc4UM",
  "re-3-1": "Tn6-PIqc4UM",
  "ts-1-1": "30LWjhZzg50",
  "ts-2-1": "30LWjhZzg50",
  "be-1-1": "fgTGADljAeg",
  "be-2-3": "fgTGADljAeg",
  "git-1-1": "RGOj5yH7evk",
  "git-2-1": "RGOj5yH7evk",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const course = getCourse(slug);
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>();
  const [busy, setBusy] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await getStudent();
        const e = await getEnrollment(slug);
        if (cancelled) return;
        setStudent(s);
        setEnrollment(e);
      } catch {
        if (!cancelled) {
          setStudent(null);
          setEnrollment(undefined);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const flatLessons = useMemo(() => {
    if (!course) return [] as { moduleIndex: number; moduleTitle: string; lesson: Lesson }[];
    return course.modules.flatMap((mod, moduleIndex) =>
      mod.lessons.map((lesson) => ({
        moduleIndex,
        moduleTitle: mod.title,
        lesson,
      })),
    );
  }, [course]);

  useEffect(() => {
    if (!course || !enrollment) return;
    if (activeLessonId) return;
    const next = getNextIncompleteLesson(course, enrollment);
    setActiveLessonId(next?.lesson.id ?? course.modules[0]?.lessons[0]?.id ?? null);
  }, [course, enrollment, activeLessonId]);

  if (!course) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Course not found</h1>
        <Link href="/courses" className="mt-6 inline-block text-primary">
          Back to catalog
        </Link>
      </main>
    );
  }

  const lessonsCount = courseLessonCount(course);
  const nextLesson = getNextIncompleteLesson(course, enrollment);
  const allLessonsDone = isCourseLessonsComplete(course, enrollment);
  const active = flatLessons.find((f) => f.lesson.id === activeLessonId) ?? flatLessons[0];
  const activeUnlocked =
    !!enrollment && active && isModuleUnlocked(course, enrollment, active.moduleIndex);

  async function handleEnroll() {
    if (!student) {
      router.push(`/login?next=/courses/${slug}`);
      return;
    }
    setBusy(true);
    try {
      const e = await enrollInCourse(slug);
      setEnrollment(e);
      const first = course.modules[0]?.lessons[0]?.id;
      if (first) setActiveLessonId(first);
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete(lessonId: string) {
    if (!enrollment) return;
    setBusy(true);
    try {
      const e = await markLessonComplete(slug, lessonId);
      setEnrollment(e);
    } finally {
      setBusy(false);
    }
  }

  if (!enrollment) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
          <ArrowLeft className="size-4" /> All courses
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange uppercase">{course.level}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 text-base text-muted">{course.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1"><Clock className="size-4" /> {course.hours} hours</span>
              <span>{lessonsCount} lessons</span>
              <span>{course.modules.length} modules</span>
            </div>
            <h2 className="mt-10 font-display text-xl font-semibold">Course outline</h2>
            <ol className="mt-4 space-y-3">
              {course.modules.map((mod, i) => (
                <li key={mod.id} className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm font-semibold">Module {i + 1}: {mod.title}</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted">
                    {mod.lessons.map((l) => (
                      <li key={l.id} className="flex items-center gap-2">
                        <Lock className="size-3" /> {l.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
          <aside className="h-fit rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
            {course.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.thumbnail} alt="" className="mb-4 aspect-video w-full rounded-lg object-cover" />
            ) : null}
            <button
              type="button"
              onClick={handleEnroll}
              disabled={busy}
              className="flex h-12 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-fg hover:bg-primary/90 disabled:opacity-60"
            >
              {student ? (busy ? "Enrolling…" : "Enroll for free") : "Sign in to enroll"}
            </button>
            <p className="mt-3 text-xs text-muted">
              After enroll: outline, reading + video side by side, then quiz (≥{CERT_PASS_SCORE}%) for certificate. Download requires payment.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {o}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    );
  }

  const yt =
    active && (LESSON_VIDEO[active.lesson.id] || (active.lesson.kind === "video" ? "UB1O30fX-d8" : null));
  const isQuizLesson = active?.lesson.kind === "quiz";
  const done = active ? enrollment.completedLessons.includes(active.lesson.id) : false;

  return (
    <div className="min-h-[calc(100vh-4rem)] border-t border-border bg-bg">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-3 py-3 sm:px-4">
          <Link href="/courses" className="text-muted hover:text-fg">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted">Doyintech Academy</p>
            <h1 className="truncate font-display text-sm font-semibold sm:text-base">{course.title}</h1>
          </div>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
            {enrollment.completedLessons.length}/{lessonsCount} lessons
          </span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="max-h-[calc(100vh-8rem)] overflow-y-auto border-b border-border bg-surface lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
          <div className="p-3">
            <p className="px-2 text-[11px] font-semibold tracking-wider text-subtle uppercase">Course outline</p>
            <nav className="mt-2 space-y-4" aria-label="Modules">
              {course.modules.map((mod, mi) => {
                const unlocked = isModuleUnlocked(course, enrollment, mi);
                const prog = moduleProgress(mod, enrollment);
                const modDone = isModuleComplete(mod, enrollment);
                return (
                  <div key={mod.id}>
                    <div className="flex items-center gap-2 px-2 py-1">
                      {unlocked ? (
                        modDone ? (
                          <Check className="size-3.5 text-success" />
                        ) : (
                          <Unlock className="size-3.5 text-primary" />
                        )
                      ) : (
                        <Lock className="size-3.5 text-subtle" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-fg">
                          Module {mi + 1}: {mod.title}
                        </p>
                        <p className="text-[10px] text-subtle">
                          {prog.done}/{prog.total}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {mod.lessons.map((lesson) => {
                        const Icon = kindIcon[lesson.kind];
                        const isActive = lesson.id === activeLessonId;
                        const isDone = enrollment.completedLessons.includes(lesson.id);
                        const canOpen = unlocked;
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              disabled={!canOpen}
                              onClick={() => canOpen && setActiveLessonId(lesson.id)}
                              className={cn(
                                "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors",
                                isActive && "bg-primary/10 text-fg",
                                !isActive && canOpen && "text-muted hover:bg-surface-2 hover:text-fg",
                                !canOpen && "cursor-not-allowed text-subtle opacity-60",
                              )}
                            >
                              {isDone ? (
                                <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                              ) : (
                                <Icon className="mt-0.5 size-3.5 shrink-0" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="line-clamp-2 font-medium">{lesson.title}</span>
                                <span className="mt-0.5 block text-[10px] text-subtle">
                                  {kindLabel[lesson.kind]} · {lesson.durationMin} min
                                </span>
                              </span>
                              {isActive ? <ChevronRight className="size-3.5 shrink-0 text-primary" /> : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
            {allLessonsDone ? (
              <a
                href="#final-quiz"
                className="mt-4 flex items-center gap-2 rounded-md bg-orange/10 px-3 py-2 text-xs font-semibold text-orange"
              >
                <ListChecks className="size-3.5" /> Final assessment (≥{CERT_PASS_SCORE}%)
              </a>
            ) : null}
          </div>
        </aside>

        <main className="min-w-0 p-3 sm:p-5 lg:p-6">
          {active && activeUnlocked ? (
            <div className="space-y-5">
              <header>
                <p className="text-xs font-medium text-muted">
                  Module {active.moduleIndex + 1} · {active.moduleTitle}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {active.lesson.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{active.lesson.summary}</p>
              </header>

              {isQuizLesson ? (
                <QuizPanel
                  courseSlug={slug}
                  courseTitle={course.title}
                  studentName={student?.name || "Student"}
                  studentId={student?.id}
                  title={`Assessment: ${active.lesson.title}`}
                />
              ) : (
                <>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <section className="overflow-hidden rounded-xl border border-border bg-surface">
                      <div className="border-b border-border px-3 py-2 text-xs font-semibold tracking-wide text-muted uppercase">
                        Video
                      </div>
                      {yt ? (
                        <VideoPlayer
                          videoId={`course-${active.lesson.id}`}
                          youtubeId={yt}
                          title={active.lesson.title}
                          thumbnailUrl={youtubeThumb(yt)}
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-surface-2 text-sm text-muted">
                          No video for this lesson — use the reading panel.
                        </div>
                      )}
                    </section>
                    <section className="overflow-hidden rounded-xl border border-border bg-surface">
                      <div className="border-b border-border px-3 py-2 text-xs font-semibold tracking-wide text-muted uppercase">
                        Reading & practice
                      </div>
                      <div className="max-h-[28rem] overflow-y-auto p-3 sm:max-h-[32rem]">
                        <LessonContentPanel lessonId={active.lesson.id} />
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={busy || done}
                      onClick={() => handleComplete(active.lesson.id)}
                      className={cn(
                        "inline-flex h-11 items-center rounded-md px-4 text-sm font-semibold",
                        done
                          ? "bg-success/15 text-success"
                          : "bg-primary text-primary-fg hover:bg-primary/90",
                      )}
                    >
                      {done ? "Completed" : "Mark lesson complete"}
                    </button>
                    {nextLesson && nextLesson.lesson.id !== active.lesson.id ? (
                      <button
                        type="button"
                        onClick={() => setActiveLessonId(nextLesson.lesson.id)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Next: {nextLesson.lesson.title} →
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">Select an unlocked lesson from the outline.</p>
          )}

          {allLessonsDone && !isQuizLesson ? (
            <div className="mt-10 border-t border-border pt-8" id="final-quiz">
              <QuizPanel
                courseSlug={slug}
                courseTitle={course.title}
                studentName={student?.name || "Student"}
                studentId={student?.id}
                title="Final course assessment"
              />
            </div>
          ) : null}

          {!allLessonsDone && nextLesson ? (
            <p className="mt-8 text-xs text-subtle">
              Final quiz unlocks when every lesson is complete. Certificate requires ≥{CERT_PASS_SCORE}%
              on the text assessment; download requires payment.
            </p>
          ) : null}
        </main>
      </div>
    </div>
  );
}
