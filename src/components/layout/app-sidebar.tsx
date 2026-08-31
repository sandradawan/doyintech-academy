"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Code2,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/auth";

const mainNav = [
  { href: "/dashboard", label: "My learning", icon: LayoutDashboard },
  { href: "/dashboard/playground", label: "Playground", icon: Code2 },
  { href: "/courses", label: "Browse courses", icon: Search },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/", label: "Home", icon: Home },
] as const;

function NavContent({
  student,
  onSignOut,
  onClose,
}: {
  student: Student | null;
  onSignOut?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-fg">
      <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
        <Logo invert />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Student">
        {mainNav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-white/12 text-white"
                  : "text-sidebar-muted hover:bg-sidebar-hover hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/10 p-3">
        {student ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{student.name}</p>
                <p className="truncate text-xs text-sidebar-muted">{student.email}</p>
              </div>
            </div>
            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-white"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-muted hover:text-white"
          >
            <GraduationCap className="size-4" />
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

/** Full student shell: fixed left sidebar + main content */
export function StudentShell({
  student,
  onSignOut,
  title,
  subtitle,
  actions,
  children,
}: {
  student: Student | null;
  onSignOut?: () => void;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(false);

  return (
    <div className="relative min-h-dvh w-full bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border md:block">
        <NavContent student={student} onSignOut={onSignOut} />
      </aside>

      {mobile ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobile(false)}
          />
          <div className="absolute inset-y-0 left-0 w-60 max-w-[85vw] shadow-xl">
            <NavContent
              student={student}
              onSignOut={onSignOut}
              onClose={() => setMobile(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-col md:pl-60">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open menu"
          >
            {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <div className="min-w-0 flex-1">
            {title ? <p className="truncate text-sm font-semibold">{title}</p> : null}
            {subtitle ? <p className="truncate text-xs text-muted">{subtitle}</p> : null}
          </div>
          {actions}
        </header>
        <div className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar(props: {
  student: Student | null;
  onSignOut?: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <NavContent
      student={props.student}
      onSignOut={props.onSignOut}
      onClose={props.onClose}
    />
  );
}
