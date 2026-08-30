import Link from "next/link";
import { Clock, ListVideo } from "lucide-react";
import type { Course } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";

export function CourseCard({ course }: { course: Course }) {
  const lessons = courseLessonCount(course);

  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-[0_0_0_1px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(37,99,235,0.25)]">
        <div className={`relative aspect-video bg-gradient-to-br ${course.accent}`}>
          <div className="absolute inset-0 bg-black/15" />
          <span className="absolute top-3 left-3 rounded-full bg-surface-2/90 px-2.5 py-0.5 text-xs font-medium text-fg">
            {course.level}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight text-fg">{course.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{course.tagline}</p>
          </div>
          <div className="mt-auto flex items-center gap-4 text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {course.hours} hours
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ListVideo className="size-3.5" />
              {lessons} lessons
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
