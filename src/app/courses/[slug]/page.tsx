"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, Clapperboard, Clock, Code2, ListChecks } from "lucide-react";
import { getCourse } from "@/lib/courses/catalog";
import type { LessonKind } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";
import { enrollInCourse, getEnrollment, getStudent, markLessonComplete, type Enrollment, type Student } from "@/lib/auth";

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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const course = getCourse(slug);
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | undefined>();

  useEffect(() => {
    setStudent(getStudent());
    setEnrollment(getEnrollment(slug));
  }, [slug]);

  if (!course) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Course not found</h1>
        <Link href="/courses" className="mt-6 inline-block text-primary">Back to catalog</Link>
      </main>
    );
  }

  const lessons = courseLessonCount(course);

  function handleEnroll() {
    if (!getStudent()) {
      router.push(`/login?next=/courses/${slug}`);
      return;
    }
    setEnrollment(enrollInCourse(slug));
  }

  function handleComplete(lessonId: string) {
    if (!enrollment) return;
    markLessonComplete(slug, lessonId);
    setEnrollment(getEnrollment(slug));
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
            <span className="rounded-full bg-cyan/15 px-2.5 py-0.5 text-xs font-medium text-cyan">Certificate</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{course.description}</p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-subtle">
            <span className="inline-flex items-center gap-1.5"><Clock className="size-4" />{course.hours} hours</span>
            <span>{lessons} lessons</span>
            <span>{course.modules.length} modules</span>
          </div>
          <div className="mt-8">
            {enrollment ? (
              <Link href="/dashboard" className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-medium text-primary-fg">Continue in dashboard</Link>
            ) : (
              <button type="button" onClick={handleEnroll} className="inline-flex h-12 items-center rounded-lg bg-primary px-6 text-base font-medium text-primary-fg hover:bg-primary/90">
                {student ? "Enroll in this course" : "Sign in to enroll"}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight">Syllabus</h2>
          <div className="mt-4 space-y-6">
            {course.modules.map((mod, index) => (
              <div key={mod.id} className="rounded-xl border border-border bg-surface p-4">
                <h3 className="font-display text-lg font-medium">
                  <span className="mr-2 font-mono text-xs text-subtle">Module {index + 1}</span>{mod.title}
                </h3>
                <ul className="mt-3 space-y-3">
                  {mod.lessons.map((lesson) => {
                    const Icon = kindIcon[lesson.kind];
                    const done = enrollment?.completedLessons.includes(lesson.id);
                    return (
                      <li key={lesson.id} className="flex gap-3 rounded-lg bg-surface-2/60 px-3 py-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-cyan" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-fg">{lesson.title}</p>
                            <p className="text-xs text-subtle">{kindLabel[lesson.kind]} · {lesson.durationMin} min</p>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{lesson.summary}</p>
                          {enrollment ? (
                            <button type="button" onClick={() => handleComplete(lesson.id)} disabled={!!done} className={`mt-2 text-xs font-medium ${done ? "text-cyan" : "text-primary hover:underline"}`}>
                              {done ? "Completed" : "Mark complete"}
                            </button>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-medium">You will leave able to</h2>
          <ul className="mt-4 space-y-3">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2 text-sm leading-relaxed text-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-cyan" />{outcome}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
