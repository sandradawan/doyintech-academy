import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            A DoyinTech school. Short videos, written lessons, live exercises, and a named
            certificate — built for people who want to ship software.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">Learn</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/courses" className="text-muted hover:text-fg">Course catalog</Link></li>
            <li><Link href="/certificates" className="text-muted hover:text-fg">Certificates</Link></li>
            <li><Link href="/dashboard" className="text-muted hover:text-fg">Student dashboard</Link></li>
            <li><Link href="/about" className="text-muted hover:text-fg">About the academy</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-subtle uppercase">DoyinTech</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="https://doyintech.vercel.app" className="text-muted hover:text-fg" target="_blank" rel="noreferrer">Company site</a></li>
            <li><a href="https://github.com/sandradawan/doyintech-academy" className="text-muted hover:text-fg" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="mailto:doyintechnology@gmail.com" className="text-muted hover:text-fg">doyintechnology@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-subtle sm:px-6">
          © {new Date().getFullYear()} DoyinTech. Doyintech Academy.
        </p>
      </div>
    </footer>
  );
}
