"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Lock, ShieldCheck } from "lucide-react";
import { CertificateTemplate, type CertificateData } from "@/components/certificates/certificate-template";
import {
  CERT_FEE_LABEL,
  CERT_FEE_NOTE,
  CERT_PASS_SCORE,
  isCertificatePaid,
  isCertPassingScore,
} from "@/lib/certificates";
import { getStudent } from "@/lib/auth";

export function CertificateClaim({
  studentName,
  studentId,
  courseTitle,
  courseSlug,
  quizScore,
  certificateId,
  certifiedAt,
  studentEmail,
}: {
  studentName: string;
  studentId?: string;
  courseTitle: string;
  courseSlug: string;
  quizScore?: number;
  certificateId?: string;
  certifiedAt?: string;
  studentEmail?: string;
}) {
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const unlocked = isCertPassingScore(quizScore) && Boolean(certificateId);

  useEffect(() => {
    if (unlocked) {
      setPaid(isCertificatePaid(studentId, courseSlug, certificateId));
    }
  }, [unlocked, studentId, courseSlug, certificateId]);

  if (!isCertPassingScore(quizScore)) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="font-display text-lg font-semibold">Certificate</h3>
        <p className="mt-2 text-sm text-muted">
          Complete the <strong className="text-fg">module / course quiz</strong> (reading assessment)
          with a score of <strong className="text-fg">{CERT_PASS_SCORE}% or higher</strong> to unlock
          your certificate. Video progress alone does not issue a credential.
        </p>
        {typeof quizScore === "number" ? (
          <p className="mt-3 text-sm text-orange">
            Current best score: {quizScore}% — need {CERT_PASS_SCORE}%.
          </p>
        ) : null}
      </div>
    );
  }

  if (!certificateId) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="text-sm text-muted">
          You passed ({quizScore}%). Issuing certificate ID… refresh if it does not appear.
        </p>
      </div>
    );
  }

  const data: CertificateData = {
    recipientName: studentName,
    courseTitle,
    certificateId,
    issuedAt: certifiedAt || new Date().toISOString(),
    score: quizScore,
  };

  async function handlePaystack() {
    setPaying(true);
    setPayError("");
    try {
      let email = studentEmail;
      if (!email) {
        const s = await getStudent();
        email = s?.email;
      }
      if (!email) {
        setPayError("Sign in with an email account to pay with Paystack.");
        setPaying(false);
        return;
      }
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          courseSlug,
          certificateId,
          courseTitle,
          studentId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.authorization_url) {
        setPayError(json.error || "Could not start Paystack checkout.");
        setPaying(false);
        return;
      }
      window.location.href = json.authorization_url as string;
    } catch {
      setPayError("Network error starting checkout.");
      setPaying(false);
    }
  }

  function handleDownload() {
    if (!paid) return;
    const node = printRef.current;
    if (!node) return;
    const w = window.open("", "_blank", "noopener,noreferrer,width=1100,height=800");
    if (!w) {
      window.print();
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head><title>${certificateId}</title>
      <style>
        body { margin: 0; background: #f1f5f9; font-family: system-ui, sans-serif; }
        .wrap { padding: 24px; }
        @media print { body { background: white; } .wrap { padding: 0; } }
      </style></head><body><div class="wrap">${node.innerHTML}</div>
      <script>window.onload=function(){window.print();}</script></body></html>`);
    w.document.close();
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-5" id="certificate">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-success uppercase">
            <ShieldCheck className="size-3.5" aria-hidden /> Certificate unlocked
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold">{courseTitle}</h3>
          <p className="mt-1 text-sm text-muted">
            Score {quizScore}% · ID <span className="font-mono text-fg">{certificateId}</span>
          </p>
        </div>
        {paid ? (
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary/90"
          >
            <Download className="size-4" aria-hidden /> Download certificate
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePaystack}
            disabled={paying}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#00C3F7] px-4 text-sm font-semibold text-[#0B0E14] hover:opacity-90 disabled:opacity-60"
          >
            <Lock className="size-4" aria-hidden />
            {paying ? "Redirecting to Paystack…" : `Pay ${CERT_FEE_LABEL} with Paystack`}
          </button>
        )}
      </div>

      {payError ? <p className="text-sm text-red-500">{payError}</p> : null}

      {!paid ? (
        <div className="rounded-lg border border-orange/30 bg-orange/5 p-4 text-sm text-muted">
          <p className="font-medium text-fg">Download locked until Paystack payment</p>
          <p className="mt-1">{CERT_FEE_NOTE}</p>
        </div>
      ) : null}

      <div
        ref={printRef}
        className={!paid ? "pointer-events-none select-none opacity-60 blur-[1px]" : undefined}
        aria-hidden={!paid}
      >
        <CertificateTemplate data={data} />
      </div>
    </div>
  );
}
