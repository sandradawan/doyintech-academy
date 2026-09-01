/** Pass mark for module / course certification quizzes (text-based assessment). */
export const CERT_PASS_SCORE = 60;

/** Certificate download fee (display). Charged via Paystack in NGN. */
export const CERT_FEE_LABEL = "₦2,500";
export const CERT_FEE_NOTE =
  "One-time certificate processing fee paid via Paystack. Learning content stays free after enrollment.";

const PAID_KEY = "doyintech-academy-cert-paid";

function paidMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PAID_KEY) || "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function certPaymentKey(userId: string | undefined, courseSlug: string, certificateId?: string) {
  return `${userId || "anon"}:${courseSlug}:${certificateId || "pending"}`;
}

export function isCertificatePaid(userId: string | undefined, courseSlug: string, certificateId?: string) {
  return Boolean(paidMap()[certPaymentKey(userId, courseSlug, certificateId)]);
}

export function markCertificatePaid(userId: string | undefined, courseSlug: string, certificateId?: string) {
  const map = paidMap();
  map[certPaymentKey(userId, courseSlug, certificateId)] = true;
  localStorage.setItem(PAID_KEY, JSON.stringify(map));
}

export function isCertPassingScore(score: number | undefined | null) {
  return typeof score === "number" && score >= CERT_PASS_SCORE;
}

/** Prefer DB payment record; fall back to localStorage. */
export async function resolveCertificatePaid(opts: {
  userId?: string;
  courseSlug: string;
  certificateId?: string;
}): Promise<boolean> {
  if (isCertificatePaid(opts.userId, opts.courseSlug, opts.certificateId)) return true;
  if (!opts.certificateId || typeof window === "undefined") return false;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("payments")
      .select("id")
      .eq("certificate_id", opts.certificateId)
      .eq("status", "success")
      .limit(1)
      .maybeSingle();
    if (data) {
      markCertificatePaid(opts.userId, opts.courseSlug, opts.certificateId);
      return true;
    }
  } catch {
    /* offline / RLS */
  }
  return false;
}
