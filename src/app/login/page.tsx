"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { getStudent, signIn, signUp } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (mode === "signup") {
      if (!name.trim()) {
        setError("Enter your full name.");
        return;
      }
      signUp(name, email);
      router.push(next);
      return;
    }
    const student = signIn(email);
    if (!student) {
      if (!getStudent()) {
        setError("No account on this device. Create one first.");
        return;
      }
      setError("Email does not match the account on this device.");
      return;
    }
    router.push(next);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs font-medium tracking-widest text-cyan uppercase">Student access</p>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Accounts are stored on this device for the demo. Use the same browser to keep progress.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {mode === "signup" ? (
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-ring" placeholder="Ada Lovelace" autoComplete="name" />
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none focus:ring-2 focus:ring-ring" placeholder="ada@example.com" autoComplete="email" />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-fg hover:bg-primary/90">
          {mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        {mode === "signup" ? "Already have an account on this device?" : "New here?"}{" "}
        <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}>
          {mode === "signup" ? "Sign in" : "Create account"}
        </button>
      </p>
      <p className="mt-4 text-sm"><Link href="/courses" className="text-muted hover:text-fg">Browse courses without an account</Link></p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-16 text-center text-muted">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
