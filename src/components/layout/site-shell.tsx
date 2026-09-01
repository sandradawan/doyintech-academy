"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

function isBareRoute(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dt-ops-console") ||
    pathname.startsWith("/login")
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const bare = isBareRoute(pathname);

  if (bare) {
    return <div className="min-h-dvh bg-bg text-fg">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader />
      <div className="flex-1 animate-fade-in">{children}</div>
      <SiteFooter />
    </div>
  );
}
