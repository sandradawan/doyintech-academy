import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logo mark aligned with DoyinTech (https://doyintech.vercel.app):
 * orange circular badge + white geometric monogram.
 * Academy variant: open book / learning arc inside the same orange disc.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9 shrink-0", className)}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="dt-orange" x1="8" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="0.55" stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#dt-orange)" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1" />
      <path
        fill="#FFFFFF"
        d="M14 11.5h7.2c4.35 0 7.05 2.55 7.05 6.5v4c0 3.95-2.7 6.5-7.05 6.5H14V11.5zm3.35 3.15v10.7h3.85c2.55 0 4-1.45 4-3.85v-3c0-2.4-1.45-3.85-4-3.85H17.35z"
      />
      <circle cx="29.5" cy="12" r="1.6" fill="#FFFFFF" fillOpacity="0.95" />
    </svg>
  );
}

export function LogoMarkSimple({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#F97316" />
      <path
        fill="#FFFFFF"
        d="M11 9h5.6c3.5 0 5.6 2 5.6 5.1v3.8c0 3.1-2.1 5.1-5.6 5.1H11V9zm2.7 2.5v9h3c2 0 3.15-1.15 3.15-3.05v-2.9c0-1.9-1.15-3.05-3.15-3.05h-3z"
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
        <span className="font-display text-[15px] font-semibold tracking-tight text-fg">
          Doyin<span className="text-primary">Tech</span>
        </span>
        <span className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
          Academy
        </span>
      </span>
    </Link>
  );
}
