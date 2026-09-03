"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { signIn, signOut, getStudent } from "@/lib/auth";
import { fetchIsAdmin } from "@/lib/admin-crm";
import { cn } from "@/lib/utils";
import { adminHref, ADMIN_PUBLIC_BASE } from "@/lib/admin-path";

const nav = [
  { href: adminHref(""), label: "Overview", icon: LayoutDashboard, exact: true },
  { href: adminHref("/students"), label: "Students", icon: Users },
  { href: adminHref("/enrollments"), label: "Enrollments", icon: GraduationCap },
  { href: adminHref("/payments"), label: "Payments", icon: CreditCard },
  { href: adminHref("/content"), label: "Content", icon: BookOpen },
  { href: adminHref("/quizzes"), label: "Quizzes", icon: ClipboardList },
  { href: adminHref("/waitlist"), label: "Waitlist", icon: ListOrdered },
  { href: adminHref("/settings"), label: "Settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await fetchIsAdmin();
        if (cancelled) return;
        setAuthed(ok);
        if (ok) {
          const s = await getStudent();
          if (!cancelled) setAdminName(s?.name || s?.email || "Admin");
        }
      } catch {
        if (!cancelled) setAuthed(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    const { student, error: err } = await signIn(email, password);
    if (err || !student) {
      setError(err || "Sign-in failed");
      return;
    }
    const ok = await fetchIsAdmin();
    if (!ok) {
      setError("This account is not an admin. Run: update profiles set role = 'admin' where email = '…'");
      await signOut();
      return;
    }
    setAuthed(true);
    setAdminName(student.name || student.email || "Admin");
    router.refresh();
  }

  async function onLogout() {
    await signOut();
    setAuthed(false);
    router.push(ADMIN_PUBLIC_BASE || "/admin");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading…</div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <form onSubmit={onLogin} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-center font-display text-xl font-semibold">Admin sign in</h1>
          <p className="text-center text-xs text-muted">CRM for students, payments, and content</p>
          {error ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
          ) : null}
          <label className="block text-sm">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm"
            />
          </label>
          <button type="submit" className="h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-fg">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-bg">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
        <div className="border-b border-border px-4 py-4">
          <Logo />
          <p className="mt-1 truncate text-xs text-muted">{adminName}</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href || pathname === `${item.href}/`
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  active ? "bg-primary/10 font-semibold text-primary" : "text-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="m-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-2"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:hidden">
          <button type="button" onClick={() => setMobile(true)} className="rounded-md p-2 hover:bg-surface-2">
            <Menu className="size-5" />
          </button>
          <span className="font-display text-sm font-semibold">Admin</span>
        </header>
        {mobile ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button type="button" className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
            <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-surface shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <Logo />
                <button type="button" onClick={() => setMobile(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 p-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobile(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-2"
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ) : null}
        <main className="flex-1 overflow-x-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
