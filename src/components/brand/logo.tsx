import Link from "next/link";
import { cn } from "@/lib/utils";

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

export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 no-underline", className)}
      aria-label="Doyintech Academy home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[15px] font-semibold tracking-tight",
            invert ? "text-white" : "text-fg",
          )}
        >
          Doyin<span className={invert ? "text-orange" : "text-primary"}>Tech</span>
        </span>
        <span className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
          Academy
        </span>
      </span>
    </Link>
  );
}
