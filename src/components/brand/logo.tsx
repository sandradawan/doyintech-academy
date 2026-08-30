import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Doyintech Academy logo
 * — Keeps the DoyinTech orange disc from https://doyintech.vercel.app
 * — Primary mark is a bold Academy "A" (learning / achievement)
 * — Small open-book stroke under the A ties education to the brand
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
      <circle cx="20" cy="20" r="18" fill="none" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1" />
      <path
        fill="#FFFFFF"
        d="M20 9.2L11.2 28.2h3.55l1.7-4.15h7.1l1.7 4.15H29L20 9.2zm0 5.15l2.55 6.25h-5.1L20 14.35z"
      />
      <path
        d="M13.5 31.2c2.1-1.35 4.2-2 6.5-2s4.4.65 6.5 2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <path
        d="M20 29.2v2.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
    </svg>
  );
}

export function LogoMarkSimple({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#F97316" />
      <path
        fill="#FFFFFF"
        d="M16 6.8L9.2 22.2h2.85l1.35-3.3h5.2l1.35 3.3H22.8L16 6.8zm0 4.2l2 4.95h-4L16 11z"
      />
      <path
        d="M11 24.6c1.6-1 3.2-1.5 5-1.5s3.4.5 5 1.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
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
        <span className="text-[11px] font-semibold tracking-[0.16em] text-orange-500 uppercase">
          Academy
        </span>
      </span>
    </Link>
  );
}
