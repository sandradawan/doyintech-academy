"use client";

import { FormEvent, useState } from "react";
import { addToWaitlist } from "@/lib/admin";

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = addToWaitlist(name, email);
    setOk(result.ok);
    setMessage(result.message);
    if (result.ok) {
      setName("");
      setEmail("");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-surface p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      <p className="text-xs font-medium tracking-widest text-cyan uppercase">First cohort</p>
      <h3 className="mt-2 font-display text-xl font-medium tracking-tight">Join the waitlist</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Get a seat when live coaching and graded quizzes open. No spam — one email when we launch.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-name" className="text-xs font-medium text-subtle">Name</label>
          <input id="wl-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="wl-email" className="text-xs font-medium text-subtle">Email</label>
          <input id="wl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-ring" placeholder="you@example.com" autoComplete="email" />
        </div>
      </div>
      <button type="submit" className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-fg hover:bg-primary/90">
        Join waitlist
      </button>
      {message ? <p className={`mt-3 text-sm ${ok ? "text-cyan" : "text-red-400"}`}>{message}</p> : null}
    </form>
  );
}
