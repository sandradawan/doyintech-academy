"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { markCertificatePaid } from "@/lib/certificates";
import { getStudent } from "@/lib/auth";
import { recordCrmPayment } from "@/lib/admin-crm";
import { CERT_FEE_KOBO } from "@/lib/paystack";

function CallbackInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying payment…");

  const reference = params.get("reference") || params.get("trxref") || "";
  const courseSlug = params.get("course") || "";
  const certificateId = params.get("cert") || "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!reference) {
        setStatus("failed");
        setMessage("Missing payment reference.");
        return;
      }
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.paid) {
          setStatus("failed");
          setMessage(data.error || "Payment was not successful.");
          return;
        }
        const student = await getStudent();
        const slug = courseSlug || data.metadata?.course_slug || "";
        const cert = certificateId || data.metadata?.certificate_id || "";
        if (slug && cert) {
          markCertificatePaid(student?.id, slug, cert);
          recordCrmPayment({
            reference: reference,
            email: data.customer || student?.email || "unknown",
            studentId: student?.id,
            courseSlug: slug,
            courseTitle: data.metadata?.course_title,
            certificateId: cert,
            amountKobo: typeof data.amount === "number" ? data.amount : CERT_FEE_KOBO,
            currency: data.currency || "NGN",
            status: "success",
            paidAt: data.paidAt || new Date().toISOString(),
            provider: "paystack",
          });
        }
        setStatus("success");
        setMessage("Payment confirmed. Your certificate is ready to download.");
        if (slug) {
          setTimeout(() => router.replace(`/courses/${slug}#certificate`), 1800);
        }
      } catch {
        if (!cancelled) {
          setStatus("failed");
          setMessage("Could not verify payment. Contact support with your reference.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reference, courseSlug, certificateId, router]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {status === "loading" ? (
        <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
      ) : status === "success" ? (
        <CheckCircle2 className="size-12 text-success" aria-hidden />
      ) : (
        <XCircle className="size-12 text-orange" aria-hidden />
      )}
      <h1 className="mt-4 font-display text-xl font-semibold">
        {status === "loading"
          ? "Confirming payment"
          : status === "success"
            ? "Payment successful"
            : "Payment issue"}
      </h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {reference ? <p className="mt-2 font-mono text-xs text-subtle">Ref: {reference}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {courseSlug ? (
          <Link
            href={`/courses/${courseSlug}#certificate`}
            className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg"
          >
            Back to certificate
          </Link>
        ) : null}
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-semibold"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted">Loading…</div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
