"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Search } from "lucide-react";

export default function VerifyLookupPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = id.trim();
    if (!cleaned) {
      setError("Enter a certificate ID.");
      return;
    }
    setError("");
    router.push(`/certificates/verify/${encodeURIComponent(cleaned)}`);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Award className="size-7" />
        </div>
        <h1 className="mt-4 text-center font-display text-2xl font-semibold">
          Verify a certificate
        </h1>
        <p className="mt-1 text-center text-sm text-muted">
          Enter the certificate ID printed on the document.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <label className="block text-sm font-medium">
            Certificate ID
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="e.g. DTA-WF-2026-XXXXXXXX"
              className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 font-mono text-sm"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-fg hover:bg-primary/90"
          >
            <Search className="size-4" />
            Verify
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Employers and schools can confirm completion without logging in.
        </p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <Link href="/certificates" className="font-medium text-primary hover:underline">
            About certificates
          </Link>
          <Link href="/courses" className="font-medium text-primary hover:underline">
            Browse courses
          </Link>
        </div>
      </div>
    </main>
  );
}
