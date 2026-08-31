import Link from "next/link";
import { Clock, ListTree } from "lucide-react";
import type { Course } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";

export function CourseCard({ course }: { course: Course }) {
  const lessons = courseLessonCount(course);
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow group-hover:shadow-lg group-hover:shadow-black/20">
        <div className={`relative aspect-video bg-gradient-to-br ${course.accent}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-display text-lg font-medium text-white drop-shadow-sm">{course.title}</p>
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {course.level}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h2 className="font-display text-lg font-medium tracking-tight text-fg">{course.title}</h2>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{course.tagline}</p>
          <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {course.hours} hours
            </span>
            <span className="inline-flex items-center gap-1">
              <ListTree className="size-3.5" /> {lessons} lessons
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
