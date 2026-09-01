import Link from "next/link";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses/catalog";

type Props = { params: Promise<{ id: string }> };

export default async function VerifyCertificatePage({ params }: Props) {
  const { id } = await params;
  const certId = decodeURIComponent(id || "").trim();

  let row: {
    certificate_id: string;
    course_slug: string;
    student_name: string;
    quiz_score: number | null;
    certified_at: string | null;
    paid: boolean;
  } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("verify_certificate", { p_certificate_id: certId });
    if (Array.isArray(data) && data[0]) row = data[0];
    else if (data && !Array.isArray(data)) row = data as typeof row;
  } catch {
    row = null;
  }

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
                <dt className="text-muted">Issued</dt>
                <dd className="font-medium">
                  {row.certified_at ? new Date(row.certified_at).toLocaleDateString() : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">ID</dt>
                <dd className="font-mono text-xs">{row.certificate_id}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-red-500">
              <XCircle className="size-5" />
              <span className="text-sm font-semibold">Not found</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              No certificate matches <code className="text-xs">{certId || "—"}</code>.
            </p>
          </div>
        )}

        <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
          Back to academy
        </Link>
      </div>
    </main>
  );
}
