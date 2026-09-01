import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Mail,
  Youtube,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

const social = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@doyintechfoundation",
    icon: Youtube,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/doyintechnology",
    icon: null,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/doyintechofficial",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/doyintechnology",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@doyintechfoundation",
    icon: null,
  },
  {
    label: "GitHub",
    href: "https://github.com/sandradawan/doyintech-academy",
    icon: Github,
  },
] as const;

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.76 1.52V6.8a4.85 4.85 0 0 1-.999-.11z" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A DoyinTech school. Short videos, written lessons, practice, quizzes, and named
            certificates — built for people who want to ship software.
          </p>
          <p className="mt-3 text-xs text-subtle">Jos, Nigeria · Production-grade learning</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Learn</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/courses" className="text-muted transition-colors hover:text-fg">
                Course catalog
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-muted transition-colors hover:text-fg">
                Student dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/playground" className="text-muted transition-colors hover:text-fg">
                Code playground
              </Link>
            </li>
            <li>
              <Link href="/certificates" className="text-muted transition-colors hover:text-fg">
                Certificates
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-muted transition-colors hover:text-fg">
                About the academy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://doyintech.vercel.app"
                className="text-muted transition-colors hover:text-fg"
                target="_blank"
                rel="noreferrer"
              >
                DoyinTech website
              </a>
            </li>
            <li>
              <Link href="/privacy" className="text-muted transition-colors hover:text-fg">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-muted transition-colors hover:text-fg">
                Terms
              </Link>
            </li>
            <li>
              <a
                href="mailto:doyintechnology@outlook.com"
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
              >
                <Mail className="size-3.5" aria-hidden />
                doyintechnology@outlook.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Follow us</p>
          <p className="mt-2 text-xs text-muted">Same handles as the DoyinTech website.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {social.map((s) => {
              const Icon =
                s.label === "X (Twitter)"
                  ? XIcon
                  : s.label === "TikTok"
                    ? TikTokIcon
                    : s.icon;
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-bg text-muted transition-colors hover:border-primary/40 hover:text-fg"
                  >
                    {Icon ? <Icon className="size-4" /> : <span className="text-xs">{s.label[0]}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} DoyinTech. Doyintech Academy. All rights reserved.</p>
          <p className="text-subtle/80">Learn · Ship · Certify</p>
        </div>
      </div>
    </footer>
  );
}
