"use client";

import { useMemo, useState } from "react";
import { Check, Link2, Linkedin, Share2 } from "lucide-react";

type Props = {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  score?: number | null;
};

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
          <Linkedin className="size-3.5" /> LinkedIn
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
