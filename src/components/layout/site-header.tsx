"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { getStudent, type Student } from "@/lib/auth";
import { courses } from "@/lib/courses/catalog";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/courses", label: "Courses" },
  { href: "/certificates", label: "Certificates" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return courses
      .filter((c) => {
        const hay = [c.title, c.tagline, c.description, c.slug, c.level, ...c.outcomes]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 6);
  }, [query]);

  function goSearch(e?: FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    setFocused(false);
    setOpen(false);
    router.push(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="hidden flex-1 items-center justify-center px-6 lg:flex" ref={boxRef}>
          <form onSubmit={goSearch} className="relative w-full max-w-md">
            <div className="flex h-11 items-center gap-2 rounded-full border border-border bg-bg px-3 transition-colors focus-within:border-primary/50">
              <Search className="size-4 shrink-0 text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                placeholder="Search for courses"
                className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
                aria-label="Search courses"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-muted hover:bg-surface-2 hover:text-fg"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
            {focused && (query.trim() || suggestions.length > 0) ? (
              <div className="absolute top-full right-0 left-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">
                    {query.trim()
                      ? `No courses match “${query.trim()}”. Press Enter to search catalog.`
                      : "Type a topic, e.g. Python, React, SQL"}
                  </p>
                ) : (
                  <ul className="max-h-72 overflow-y-auto py-1">
                    {suggestions.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/courses/${c.slug}`}
                          onClick={() => {
                            setFocused(false);
                            setQuery("");
                          }}
                          className="block px-4 py-2.5 hover:bg-surface-2"
                        >
                          <span className="block text-sm font-medium text-fg">{c.title}</span>
                          <span className="block truncate text-xs text-muted">
                            {c.level} · {c.tagline}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        type="submit"
                        className="w-full border-t border-border px-4 py-2.5 text-left text-xs font-semibold text-primary hover:bg-surface-2"
                      >
                        View all results for “{query.trim()}” →
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : null}
          </form>
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
        <ThemeToggle className="shrink-0" />
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
          <form onSubmit={goSearch} className="mb-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses…"
                className="h-11 w-full rounded-md border border-border bg-bg pr-3 pl-10 text-sm outline-none focus:border-primary"
              />
            </label>
          </form>
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
