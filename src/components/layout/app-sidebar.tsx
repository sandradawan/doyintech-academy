"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Code2,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
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

export function AppSidebar({
  student,
  onSignOut,
  mobileOpen,
  onClose,
}: {
  student: Student | null;
  onSignOut?: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Logo invert />
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Student">
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
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200",
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
      <div className="border-t border-white/10 p-4">
        {student ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
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
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-white"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-sidebar-muted hover:text-white"
          >
            <GraduationCap className="size-4" />
            Sign in
          </Link>
        )}
      </div>
    </div>
  );

  return content;
}
