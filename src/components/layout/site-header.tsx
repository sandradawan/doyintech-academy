"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { getStudent, type Student } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/courses", label: "Courses" },
  { href: "/certificates", label: "Certificates" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStudent()
      .then((s) => {
        if (!cancelled) setStudent(s);
      })
      .catch(() => {
        if (!cancelled) setStudent(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex">
          <Link
            href="/courses"
            className="flex h-11 max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-bg px-4 text-sm text-muted transition-colors hover:border-primary/40 hover:text-fg"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span>Search for courses</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {student ? (
            <Link
              href="/dashboard"
              className="ml-2 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary/90"
            >
              My learning
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-2 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary/90"
            >
              Sign in
            </Link>
          )}
        </nav>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-border md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="animate-slide-up border-t border-border px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={student ? "/dashboard" : "/login"}
              onClick={() => setOpen(false)}
              className="min-h-11 rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-fg"
            >
              {student ? "My learning" : "Sign in"}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
