"use client";

import { useMemo, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

type Props = {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  score?: number | null;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-.004-4.125 2.062 2.062 0 0 1 .004 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareCertificate({ certificateId, studentName, courseTitle, score }: Props) {
  const [copied, setCopied] = useState(false);
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = `${base}/certificates/verify/${encodeURIComponent(certificateId)}`;
  const ogUrl = `${base}/certificates/og?name=${encodeURIComponent(studentName)}&course=${encodeURIComponent(courseTitle)}&id=${encodeURIComponent(certificateId)}${score != null ? `&score=${score}` : ""}`;
  const text = `I earned a Doyintech Academy certificate for ${courseTitle}!`;

  const linkedIn = useMemo(() => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
  }, [verifyUrl]);

  const twitter = useMemo(() => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(verifyUrl)}`;
  }, [text, verifyUrl]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-bg p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Share2 className="size-4 text-primary" />
        Share certificate
      </p>
      <p className="mt-1 text-xs text-muted">Public verification link + social preview image.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={linkedIn}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold hover:bg-surface-2"
        >
          <LinkedInIcon className="size-3.5" /> LinkedIn
        </a>
        <a
          href={twitter}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold hover:bg-surface-2"
        >
          Share on X
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-semibold hover:bg-surface-2"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Link2 className="size-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={ogUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary/15"
        >
          Preview card
        </a>
      </div>
    </div>
  );
}
