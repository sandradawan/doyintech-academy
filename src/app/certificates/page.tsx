import Link from "next/link";
import { Check } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

const rules = [
  "Finish the lessons in a course — video, reading, and exercises.",
  "Sit the end-of-course quiz. The pass mark is 70%.",
  "We issue a certificate with your name, the course, the date, and a unique ID.",
  "Participation without a passing score is not certified.",
];

export default function CertificatesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-cyan uppercase">Credentials</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight">Certificates you can stand behind.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Issued per course, only after a passing quiz.
      </p>
      <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
        <figure className="relative overflow-hidden rounded-xl bg-surface p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] sm:p-8">
          <div className="relative rounded-lg border border-border px-5 py-8 sm:px-10 sm:py-12">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <LogoMark className="size-7" />
                <span className="font-display text-sm font-medium">Doyintech Academy</span>
              </div>
              <span className="text-xs tracking-widest text-subtle uppercase">Certificate</span>
            </div>
            <p className="mt-8 text-xs tracking-widest text-cyan uppercase">Certificate of completion</p>
            <p className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl">React Essentials</p>
            <p className="mt-6 text-sm text-muted">Awarded to</p>
            <p className="mt-1 font-display text-xl">Silas Doyin Jonathan</p>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5 text-xs text-subtle">
              <span>30 August 2026</span>
              <span className="font-mono tracking-wide">DTA-RE-0001</span>
            </div>
          </div>
        </figure>
        <div>
          <ol className="space-y-4">
            {rules.map((rule, index) => (
              <li key={rule} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-cyan">{index + 1}</span>
                <span className="text-sm leading-relaxed text-muted">{rule}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">Choose a course</Link>
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium">Create student account</Link>
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-subtle">
            <Check className="mt-0.5 size-4 shrink-0 text-cyan" />
            Named certificates require a student account on this device.
          </p>
        </div>
      </div>
    </main>
  );
}
