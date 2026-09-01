"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  BookOpen,
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
    setAdminName(student.name);
  }

  async function logout() {
    await signOut();
    setAuthed(false);
    router.push(ADMIN_PUBLIC_BASE);
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading admin…</div>
    );
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
        <p className="text-xs font-semibold tracking-widest text-orange uppercase">Admin CRM</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">Sign in with admin account</h1>
        <p className="mt-2 text-sm text-muted">
          Uses Supabase Auth. Your profiles.role must be <code className="text-fg">admin</code>.
        </p>
        <form onSubmit={onLogin} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6">
          <label className="block text-sm font-medium">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm" />
          </label>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button type="submit" className="flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-fg">
            Sign in to CRM
          </button>
        </form>
        <Link href="/" className="mt-6 text-center text-sm text-primary hover:underline">← Back to site</Link>
      </main>
    );
  }

  const sidebar = (
    <div className="flex h-full w-full flex-col bg-[#0B0E14] text-white">
      <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
        <Logo invert />
        <span className="ml-2 rounded bg-orange/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-orange uppercase">CRM</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Admin">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobile(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
              )}>
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-3">
        <p className="mb-2 truncate px-3 text-xs text-white/50">{adminName}</p>
        <Link href="/" className="mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">View site</Link>
        <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh w-full bg-bg">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 overflow-hidden border-r border-border md:block">
        {sidebar}
      </aside>
      {mobile ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 w-60 max-w-[85vw] shadow-xl">{sidebar}</div>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-md border border-border md:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Admin CRM</p>
            <p className="truncate text-xs text-muted">Live Supabase data</p>
          </div>
        </header>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
