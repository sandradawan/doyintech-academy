"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Code2, Menu } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CodePlayground } from "@/components/playground/code-playground";
import { getStudent, signOut, type Student } from "@/lib/auth";

export default function PlaygroundPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [ready, setReady] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const s = await getStudent();
      if (cancelled) return;
      if (!s) {
        router.replace("/login?next=/dashboard/playground");
        setReady(true);
        return;
      }
      setStudent(s);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted">Loading…</div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-bg">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border md:block">
        <div className="h-full bg-sidebar text-sidebar-fg">
          <AppSidebar student={student} onSignOut={handleSignOut} />
        </div>
      </aside>

      {mobileNav ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileNav(false)}
          />
          <div className="absolute inset-y-0 left-0 w-60 max-w-[85vw] bg-sidebar text-sidebar-fg shadow-xl">
            <AppSidebar
              student={student}
              onSignOut={handleSignOut}
              mobileOpen
              onClose={() => setMobileNav(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <Code2 className="size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Practice playground</p>
              <p className="truncate text-xs text-muted">Write code · run · see output</p>
            </div>
          </div>
          <Link href="/dashboard" className="ml-auto text-xs font-medium text-primary hover:underline">
            Back to learning
          </Link>
        </header>

        <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6">
          <CodePlayground />
        </div>
      </div>
    </div>
  );
}
