"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { signIn, signUp } from "@/lib/auth";

function AuthForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Enter your full name.");
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(name.trim(), cleanEmail, password);
        if (err) {
          setError(friendlyAuthError(err));
          setLoading(false);
          return;
        }
      } else {
        const { error: err } = await signIn(cleanEmail, password);
        if (err) {
          setError(friendlyAuthError(err));
          setLoading(false);
          return;
        }
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-8" />
          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          {mode === "signup" ? (
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error ? (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-fg hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === "signin" ? "No account?" : "Already registered?"}{" "}
          <button
            type="button"
            className="font-semibold text-primary hover:underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-muted hover:text-fg">
            ← Home
          </Link>
        </p>
      </div>
    </main>
  );
}

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials")) {
    return "Wrong email or password.";
  }
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "That email is already registered. Sign in instead.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirm your email, then sign in.";
  }
  if (m.includes("password")) {
    return "Password does not meet requirements.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  return message;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading…</main>}>
      <AuthForm />
    </Suspense>
  );
}
