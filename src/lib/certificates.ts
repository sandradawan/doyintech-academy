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
