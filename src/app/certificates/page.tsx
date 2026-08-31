import Link from "next/link";
import { Check } from "lucide-react";
import { CertificatePreview } from "@/components/certificates/certificate-template";

const rules = [
  "Finish every module in order — lessons unlock as you go.",
  "Pass the end-of-course quiz at 70% or higher.",
  "We issue a certificate with your name, course, date, and unique ID.",
  "Participation without a passing score is not certified.",
];

export default function CertificatesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-orange uppercase">Credentials</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight">
        Certificates you can stand behind.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Issued per course after a passing quiz — designed in the DoyinTech brand: white field, navy
        corners, gold-orange seals, and a unique certificate ID.
      </p>

      <div className="mt-12 overflow-x-auto rounded-xl bg-surface p-4 sm:p-8">
        <CertificatePreview />
      </div>

      <div className="mt-14 grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-medium">How you earn it</h2>
          <ol className="mt-6 space-y-4">
            {rules.map((rule, index) => (
              <li key={rule} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-primary">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-muted">{rule}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/courses" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">
              Choose a course
            </Link>
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium">
              Create student account
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-medium">What is included</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-cyan" /> Student full name</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-cyan" /> Course title and score</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-cyan" /> Unique certificate ID</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-cyan" /> Issue date</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
