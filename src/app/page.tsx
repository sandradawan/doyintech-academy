import Link from "next/link";
import { ArrowRight, BookOpen, Clapperboard, Code2, Award, Check } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { catalogStats, featuredCourses } from "@/lib/courses/catalog";

export default function HomePage() {
  const featured = featuredCourses();
  const stats = catalogStats();

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg to-cyan/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="text-xs font-medium tracking-widest text-cyan uppercase">DoyinTech school</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Learn to code. Ship work you can show.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Short videos, written lessons, and exercises. Finish a course, pass the quiz, and earn a named certificate.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/courses" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-fg hover:bg-primary/90">
              Browse courses <ArrowRight className="size-4" />
            </Link>
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-base font-medium text-fg hover:bg-surface-2">
              Create student account
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/80 pt-8">
            <div><dt className="text-xs tracking-widest text-subtle uppercase">Courses</dt><dd className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.courseCount}</dd></div>
            <div><dt className="text-xs tracking-widest text-subtle uppercase">Lessons</dt><dd className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.lessonCount}</dd></div>
            <div><dt className="text-xs tracking-widest text-subtle uppercase">Hours</dt><dd className="mt-1 font-display text-2xl font-medium tabular-nums">{stats.hours}+</dd></div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium tracking-widest text-cyan uppercase">Method</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">Four moves. Then you can ship.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clapperboard, title: "Watch", body: "Short videos. One idea at a time." },
            { icon: BookOpen, title: "Read", body: "Written lessons you can search later." },
            { icon: Code2, title: "Practice", body: "In-browser exercises. You write the code." },
            { icon: Award, title: "Certify", body: "Pass at 70%. Print a named certificate." },
          ].map((step, i) => (
            <article key={step.title} className="rounded-xl bg-surface p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between">
                <step.icon className="size-5 text-cyan" />
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-cyan uppercase">Catalog</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">Start with a path, not a playlist.</h2>
            </div>
            <Link href="/courses" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-2">All courses</Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-xs font-medium tracking-widest text-cyan uppercase">Proof</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium tracking-tight">A certificate with your name.</h2>
        <ul className="mt-6 space-y-3">
          {["Your legal name on the document", "Course title, date, and unique ID", "Issued only after a passing quiz score"].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-cyan" />{item}
            </li>
          ))}
        </ul>
        <Link href="/certificates" className="mt-8 inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-surface-2">How certification works</Link>
      </section>
    </main>
  );
}
