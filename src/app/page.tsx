import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Clapperboard,
  Code2,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { VideoLessonCard } from "@/components/home/video-lesson-card";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { catalogStats, featuredCourses } from "@/lib/courses/catalog";
import { landingVideos, learningSteps, testimonials } from "@/lib/content/landing";

export default function HomePage() {
  const featured = featuredCourses();
  const stats = catalogStats();
  const [heroVideo, ...moreVideos] = landingVideos;

  return (
    <main>
      <section className="hero-mesh relative isolate overflow-hidden border-b border-border">
        <HeroSlideshow />
        <div className="relative z-10">
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="animate-slide-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold tracking-wide text-orange uppercase backdrop-blur-sm">
                <Sparkles className="size-3.5" aria-hidden />
                DoyinTech school
              </p>
              <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] drop-shadow-sm">
                Learn to code. Ship work you can show.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                Short videos, written lessons, and exercises. Finish modules in order, pass the quiz,
                and earn a named certificate from Doyintech Academy.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/courses"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-fg transition-colors hover:bg-primary/90"
                >
                  Browse courses <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Create free account
                </Link>
              </div>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-8">
                <div>
                  <dt className="text-xs font-medium tracking-widest text-white/55 uppercase">Courses</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">{stats.courseCount}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium tracking-widest text-white/55 uppercase">Lessons</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">{stats.lessonCount}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium tracking-widest text-white/55 uppercase">Hours</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-white tabular-nums">{stats.hours}+</dd>
                </div>
              </dl>
            </div>

            <div className="animate-slide-up stagger-2">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-surface/95 shadow-xl shadow-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-medium text-muted">Featured lesson</span>
                </div>
                <VideoLessonCard video={heroVideo} featured />
              </div>
              <p className="mt-3 text-center text-xs text-white/65">
                Sample lesson video · Full paths unlock inside each course
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-orange uppercase">Method</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight">
            Four moves. Then you can ship.
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningSteps.map((step, i) => (
              <li key={step.title} className="relative rounded-xl border border-border bg-bg p-5">
                <span className="font-mono text-xs font-semibold text-primary">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-orange uppercase">Free sample lessons</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Watch before you enroll</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                Real lesson topics from Web Foundations, JavaScript, and React. Press play — then continue inside the full course path.
              </p>
            </div>
            <Link href="/courses" className="inline-flex h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <PlayCircle className="size-4" aria-hidden />
              All courses
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {moreVideos.map((v) => (
              <VideoLessonCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-orange uppercase">Curriculum</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Built like a studio, not a playlist</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Clapperboard, title: "Short videos", body: "One concept per clip. Notes sit beside the player in every lesson." },
              { icon: BookOpen, title: "Written content", body: "Markdown lessons, code blocks, and practice prompts." },
              { icon: Code2, title: "Interactive practice", body: "Exercises after key lessons. Mark complete to unlock modules." },
              { icon: Lock, title: "Learn as you go", body: "Modules stay locked until the previous one is finished." },
              { icon: Award, title: "Named certificates", body: "Pass at 70%+ and get a certificate ID you can share." },
              { icon: Check, title: "Quiz gates", body: "End-of-course assessments before certification." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-bg p-5">
                <item.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-orange uppercase">Catalog</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Start with a path, not a playlist</h2>
            </div>
            <Link href="/courses" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-semibold hover:bg-surface-2">
              All courses
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-orange uppercase">Students</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Built for people who want to ship</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="flex flex-col rounded-xl border border-border bg-bg p-6">
                <p className="flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-fg">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange uppercase">Certificate</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">A credential with your name on it</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Complete the path, pass the quiz, and download a certificate designed in the DoyinTech brand.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {["Student full name", "Course title and score", "Unique certificate ID", "Issue date"].map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <Check className="size-4 text-success" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <Link href="/certificates" className="mt-8 inline-flex h-11 items-center text-sm font-semibold text-primary hover:underline">
              See certificate design →
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-display text-xl font-semibold">Stay in the loop</h3>
            <p className="mt-2 text-sm text-muted">New lessons and courses drop regularly. Join the list for launch notes.</p>
            <div className="mt-6">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
