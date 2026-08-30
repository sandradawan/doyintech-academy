import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#3B82F6" />
      <path
        fill="#F8FAFF"
        d="M12 8h6.4C22.4 8 25 10.6 25 14.4v3.2C25 21.4 22.4 24 18.4 24H12V8Zm3.2 3.2v9.6h3.2c2.2 0 3.4-1.2 3.4-3.2v-3.2c0-2-1.2-3.2-3.4-3.2h-3.2Z"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 text-fg no-underline", className)}
      aria-label="Doyintech Academy home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-sm font-semibold tracking-tight">Doyintech</span>
        <span className="text-xs font-medium tracking-widest text-muted uppercase">Academy</span>
      </span>
    </Link>
  );
}
