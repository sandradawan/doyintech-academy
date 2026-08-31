"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, BookOpen, Check, Clapperboard, Clock, Code2, ListChecks, Lock, Unlock,
} from "lucide-react";
import { getCourse } from "@/lib/courses/catalog";
import type { LessonKind } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";
import {
  enrollInCourse, getEnrollment, getStudent, markLessonComplete,
  type Enrollment, type Student,
} from "@/lib/auth";
import { QuizPanel } from "@/components/courses/quiz-panel";
import { LessonContentPanel } from "@/components/courses/lesson-content-panel";
import {
  getActiveModuleIndex, getNextIncompleteLesson, isCourseLessonsComplete,
  isModuleComplete, isModuleUnlocked, moduleProgress,
} from "@/lib/progress";

const kindIcon: Record<LessonKind, typeof Clapperboard> = {
  video: Clapperboard, text: BookOpen, interactive: Code2, quiz: ListChecks,
};
const kindLabel: Record<LessonKind, string> = {
  video: "Video", text: "Reading", interactive: "Exercise", quiz: "Quiz",
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const course = getCourse(slug);
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>();
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

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

  if (!course) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Course not found</h1>
        <Link href="/courses" className="mt-6 inline-block text-primary">Back to catalog</Link>
      </main>
    );
  }

  const resolved = course;
  const lessons = courseLessonCount(resolved);
  const activeIndex = getActiveModuleIndex(resolved, enrollment);
  const nextLesson = getNextIncompleteLesson(resolved, enrollment);
  const allLessonsDone = isCourseLessonsComplete(resolved, enrollment);

  async function handleEnroll() {
    const s = await getStudent();
    if (!s) {
      router.push(`/login?next=/courses/${slug}`);
      return;
    }
    try {
      const e = await enrollInCourse(slug);
      setEnrollment(e);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleComplete(moduleIndex: number, lessonId: string) {
    if (!enrollment || !isModuleUnlocked(resolved, enrollment, moduleIndex)) return;
    const wasComplete = isModuleComplete(resolved.modules[moduleIndex], enrollment);
    await markLessonComplete(slug, lessonId);
    const updated = await getEnrollment(slug);
    setEnrollment(updated);
    if (updated && !wasComplete && isModuleComplete(resolved.modules[moduleIndex], updated)) {
      const next = resolved.modules[moduleIndex + 1];
      if (next && isModuleUnlocked(resolved, updated, moduleIndex + 1)) {
        setJustUnlocked(next.title);
        setTimeout(() => setJustUnlocked(null), 4000);
      }
    }
  }

  return (
    <main>
      <section className={`relative isolate overflow-hidden border-b border-border bg-gradient-to-br ${course.accent}`}>
        <div className="absolute inset-0 bg-bg/75" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
            <ArrowLeft className="size-4" /> All courses
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium">{course.level}</span>
            <span className="rounded-full bg-cyan/15 px-2.5 py-0.5 text-xs font-medium text-cyan">Learn as you go</span>
            <span className="rounded-full bg-cyan/15 px-2.5 py-0.5 text-xs font-medium text-cyan">Certificate</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{course.description}</p>
          <p className="mt-3 max-w-2xl text-sm text-subtle">
            Modules unlock in order. Finish every lesson in a module to open the next one.
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-subtle">
            <span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{course.hours} hours</span>
            <span>{lessons} lessons</span>
            <span>{course.modules.length} modules</span>
            {enrollment ? (
              <span className="text-cyan">
                Active: Module {activeIndex + 1}
                {nextLesson ? ` · ${nextLesson.lesson.title}` : " · Ready for final quiz"}
              </span>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {enrollment ? (
              <>
                <a href={nextLesson ? `#module-${activeIndex}` : "#final-quiz"} className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-medium text-primary-fg">
                  {nextLesson ? "Continue learning" : "Take final quiz"}
                </a>
                <Link href="/dashboard" className="inline-flex h-12 items-center rounded-lg border border-border px-6 text-base font-medium hover:bg-surface-2">Dashboard</Link>
              </>
            ) : (
              <button type="button" onClick={handleEnroll} className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-medium text-primary-fg hover:bg-primary/90">
                {student ? "Enroll in this course" : "Sign in to enroll"}
              </button>
            )}
          </div>
          {justUnlocked ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-cyan/15 px-3 py-2 text-sm text-cyan">
              <Unlock className="size-4" /> Module unlocked: {justUnlocked}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight">Syllabus</h2>
          <div className="mt-4 space-y-6">
            {course.modules.map((mod, index) => {
              const unlocked = !enrollment || isModuleUnlocked(course, enrollment, index);
              const complete = enrollment ? isModuleComplete(mod, enrollment) : false;
              const prog = moduleProgress(mod, enrollment);
              const isActive = !!enrollment && unlocked && !complete && index === activeIndex;
              return (
                <div key={mod.id} id={`module-${index}`} className={`rounded-xl border p-4 ${unlocked ? (isActive ? "border-primary/50 bg-surface" : "border-border bg-surface") : "border-border/60 bg-surface/50 opacity-80"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-medium">
                      <span className="mr-2 font-mono text-xs text-subtle">Module {index + 1}</span>{mod.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${complete ? "bg-cyan/15 text-cyan" : unlocked ? "bg-primary/15 text-primary" : "bg-surface-2 text-subtle"}`}>
                      {complete ? <><Check className="size-3" /> Complete</> : unlocked ? <><Unlock className="size-3" /> Open</> : <><Lock className="size-3" /> Locked</>}
                    </span>
                  </div>
                  {enrollment ? (
                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                        <div className={`h-full rounded-full ${unlocked ? "bg-cyan" : "bg-subtle/40"}`} style={{ width: `${prog.percent}%` }} />
                      </div>
                      <p className="mt-1.5 text-xs text-subtle">
                        {prog.done} / {prog.total} lessons{!unlocked ? ` · Finish Module ${index} to unlock` : complete ? " · Module complete" : ""}
                      </p>
                    </div>
                  ) : null}
                  {!unlocked ? (
                    <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                      <Lock className="mt-0.5 size-4 shrink-0 text-subtle" />
                      Complete every lesson in Module {index} to unlock this module.
                    </p>
                  ) : null}
                  <ul className={`mt-3 space-y-3 ${!unlocked ? "pointer-events-none select-none" : ""}`}>
                    {mod.lessons.map((lesson) => {
                      const Icon = kindIcon[lesson.kind];
                      const done = enrollment?.completedLessons.includes(lesson.id);
                      return (
                        <li key={lesson.id} className={`flex gap-3 rounded-lg px-3 py-3 ${unlocked ? "bg-surface-2/60" : "bg-surface-2/30"}`}>
                          <Icon className={`mt-0.5 size-4 shrink-0 ${unlocked ? "text-cyan" : "text-subtle"}`} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className={`text-sm font-medium ${unlocked ? "text-fg" : "text-subtle"}`}>{lesson.title}</p>
                              <p className="text-xs text-subtle">{kindLabel[lesson.kind]} · {lesson.durationMin} min</p>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted">{lesson.summary}</p>
                            {enrollment && unlocked ? <LessonContentPanel lessonId={lesson.id} /> : null}
                            {enrollment && unlocked ? (
                              <button type="button" onClick={() => handleComplete(index, lesson.id)} disabled={!!done} className={`mt-2 text-xs font-medium ${done ? "text-cyan" : "text-primary hover:underline"}`}>
                                {done ? "Completed" : "Mark complete"}
                              </button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          {enrollment ? (
            <div className="mt-10" id="final-quiz">
              {allLessonsDone ? (
                <QuizPanel courseSlug={slug} />
              ) : (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <h3 className="font-display text-lg font-medium">Final quiz locked</h3>
                  <p className="mt-2 text-sm text-muted">Complete every module in order. The certification quiz opens when all lessons are done.</p>
                  {nextLesson ? (
                    <a href={`#module-${nextLesson.moduleIndex}`} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
                      Continue: {nextLesson.lesson.title}
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <h2 className="font-display text-lg font-medium">You will leave able to</h2>
            <ul className="mt-4 space-y-3">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" />{outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            <h2 className="font-display text-lg font-medium">Path</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Learn as you go: each module stays locked until the previous one is fully complete.
            </p>
            {enrollment ? (
              <ol className="mt-4 space-y-2">
                {course.modules.map((mod, index) => {
                  const unlocked = isModuleUnlocked(course, enrollment, index);
                  const complete = isModuleComplete(mod, enrollment);
                  return (
                    <li key={mod.id} className="flex items-center gap-2 text-xs text-muted">
                      {complete ? <Check className="size-3.5 text-cyan" /> : unlocked ? <Unlock className="size-3.5 text-primary" /> : <Lock className="size-3.5 text-subtle" />}
                      <span className={complete || unlocked ? "text-fg" : ""}>{index + 1}. {mod.title}</span>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </div>
        </aside>
      </div>
    </main>
  );
}
