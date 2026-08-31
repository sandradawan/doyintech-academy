import Link from "next/link";
import { Clock, ListTree, Star } from "lucide-react";
import type { Course } from "@/lib/courses/types";
import { courseLessonCount } from "@/lib/courses/types";

export function CourseCard({ course }: { course: Course }) {
  const lessons = courseLessonCount(course);
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <article className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${course.accent}`}>
          {course.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10" />
          <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {course.level}
          </span>
          {course.featured ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-orange/95 px-2 py-0.5 text-[11px] font-semibold text-white">
              <Star className="size-3 fill-white" aria-hidden /> Bestseller
            </span>
          ) : null}
          <p className="absolute bottom-3 left-3 right-3 font-display text-base font-semibold text-white drop-shadow">
            {course.title}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 font-display text-base font-semibold leading-snug tracking-tight text-fg group-hover:text-primary">
            {course.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{course.tagline}</p>
          <p className="mt-3 text-xs text-subtle">Doyintech Academy</p>
          <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {course.hours}h
            </span>
            <span className="inline-flex items-center gap-1">
              <ListTree className="size-3.5" aria-hidden /> {lessons} lessons
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
