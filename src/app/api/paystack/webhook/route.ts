import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CERT_FEE_KOBO } from "@/lib/paystack";

export const runtime = "nodejs";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(hash, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function persistPayment(tx: {
  reference?: string;
  status?: string;
  amount?: number;
  currency?: string;
  paid_at?: string;
  customer?: { email?: string };
  metadata?: Record<string, string | undefined>;
}) {
  const reference = tx.reference;
  if (!reference || tx.status !== "success") {
    return { ok: false as const, reason: "not_success" };
  }
  const metadata = (tx.metadata ?? {}) as Record<string, string>;
  const email = (tx.customer?.email || metadata.email || "").toLowerCase();
  const courseSlug = metadata.course_slug || metadata.courseSlug || "unknown";
  const certificateId = metadata.certificate_id || metadata.certificateId || reference;
  const amount = typeof tx.amount === "number" ? tx.amount : CERT_FEE_KOBO;

  const supabase = adminClient();
  if (!supabase) return { ok: false as const, reason: "no_supabase" };

  const { error: rpcErr } = await supabase.rpc("record_payment", {
    p_reference: reference,
    p_email: email || "unknown@paystack.local",
    p_course_slug: courseSlug,
    p_certificate_id: certificateId,
    p_amount_kobo: amount,
    p_status: "success",
    p_provider: "paystack",
    p_course_title: metadata.course_title || null,
    p_currency: tx.currency || "NGN",
    p_user_id: metadata.student_id || null,
  });

  if (!rpcErr) return { ok: true as const, reference };

  const { error: upErr } = await supabase.from("payments").upsert(
    {
      reference,
      email: email || "unknown@paystack.local",
      course_slug: courseSlug,
      course_title: metadata.course_title || null,
      certificate_id: certificateId,
      amount_kobo: amount,
      currency: tx.currency || "NGN",
      status: "success",
      provider: "paystack",
      paid_at: tx.paid_at || new Date().toISOString(),
      user_id: metadata.student_id || null,
      metadata: metadata as object,
    },
    { onConflict: "reference" },
  );

  return { ok: !upErr, reference, error: upErr?.message };
}

/** Paystack webhook — source of truth. URL: https://YOUR_DOMAIN/api/paystack/webhook */
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = event.event || "";
  if (name === "charge.success" || name === "transaction.success") {
    const result = await persistPayment(event.data as Parameters<typeof persistPayment>[0]);
    return NextResponse.json({ received: true, event: name, ...result });
  }

  return NextResponse.json({ received: true, event: name, ignored: true });
}
