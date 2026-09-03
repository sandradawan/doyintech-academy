import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses/catalog";
import { ShareCertificate } from "@/components/certificates/share-certificate";

type Props = { params: Promise<{ id: string }> };

async function loadCert(certId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("verify_certificate", { p_certificate_id: certId });
    if (Array.isArray(data) && data[0]) return data[0];
    if (data && !Array.isArray(data))
      return data as {
        certificate_id: string;
        course_slug: string;
        student_name: string;
        quiz_score: number | null;
        certified_at: string | null;
        paid: boolean;
      };
  } catch {
    return null;
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const certId = decodeURIComponent(id || "").trim();
  const row = await loadCert(certId);
  const name = row?.student_name || "Graduate";
  const course = row ? getCourse(row.course_slug) : undefined;
  const courseTitle = course?.title || row?.course_slug || "Doyintech Academy";
  const score = row?.quiz_score;
  const title = `${name} · ${courseTitle} certificate`;
  const description = `Verify this Doyintech Academy certificate${score != null ? ` (score ${score}%)` : ""}.`;
  const og = `/certificates/og?name=${encodeURIComponent(name)}&course=${encodeURIComponent(courseTitle)}&id=${encodeURIComponent(certId)}${score != null ? `&score=${score}` : ""}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { id } = await params;
  const certId = decodeURIComponent(id || "").trim();
  const row = await loadCert(certId);
  const course = row ? getCourse(row.course_slug) : undefined;
  const valid = Boolean(row?.certificate_id);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Award className="size-7" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold">Certificate verification</h1>
        <p className="mt-1 text-sm text-muted">Doyintech Academy public record</p>

        {valid && row ? (
          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="size-5" />
              <span className="text-sm font-semibold">Valid certificate</span>
            </div>
            <dl className="space-y-2 rounded-xl border border-border bg-bg p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Name</dt>
                <dd className="font-medium">{row.student_name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Course</dt>
                <dd className="text-right font-medium">{course?.title || row.course_slug}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Score</dt>
                <dd className="font-medium">{row.quiz_score != null ? `${row.quiz_score}%` : "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Certificate ID</dt>
                <dd className="break-all font-mono text-xs">{row.certificate_id}</dd>
              </div>
              {row.certified_at ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Issued</dt>
                  <dd className="font-medium">{new Date(row.certified_at).toLocaleDateString()}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Payment</dt>
                <dd className="font-medium">{row.paid ? "Verified paid" : "Quiz only"}</dd>
              </div>
            </dl>
            <p className="text-center text-xs text-muted">
              Public link:{" "}
              <span className="break-all font-mono text-[11px] text-fg">
                /certificates/verify/{row.certificate_id}
              </span>
            </p>
            <ShareCertificate
              certificateId={row.certificate_id}
              studentName={row.student_name}
              courseTitle={course?.title || row.course_slug}
              score={row.quiz_score}
            />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-2 text-red-500">
              <XCircle className="size-5" />
              <span className="text-sm font-semibold">Certificate not found</span>
            </div>
            <p className="text-sm text-muted">
              Check the ID and try again. IDs are issued after a passing course quiz.
            </p>
          </div>
        )}

        <Link href="/certificates/verify" className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline">
          Verify another ID
        </Link>
        <br />
        <Link href="/courses" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
          Browse courses
        </Link>
      </div>
    </main>
  );
}
