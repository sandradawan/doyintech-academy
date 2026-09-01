import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { CERT_FEE_KOBO } from "@/lib/paystack";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Verify Paystack transaction and persist payment (idempotent by reference). */
export async function GET(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack is not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) {
    return NextResponse.json(
      { error: data?.message || "Verification failed", paid: false },
      { status: 502 },
    );
  }

  const tx = data.data;
  const paid = tx?.status === "success";
  const metadata = (tx?.metadata ?? {}) as Record<string, string>;
  const amount = typeof tx?.amount === "number" ? tx.amount : CERT_FEE_KOBO;
  const courseSlug = metadata.course_slug || metadata.courseSlug || "";
  const certificateId = metadata.certificate_id || metadata.certificateId || "";
  const email = (tx?.customer?.email || metadata.email || "").toLowerCase();

  let persisted = false;
  if (paid && reference) {
    const supabase = adminClient();
    if (supabase) {
      try {
        const { error: rpcErr } = await supabase.rpc("record_payment", {
          p_reference: reference,
          p_email: email || "unknown@paystack.local",
          p_course_slug: courseSlug || "unknown",
          p_certificate_id: certificateId || reference,
          p_amount_kobo: amount,
          p_status: "success",
          p_provider: "paystack",
          p_course_title: metadata.course_title || null,
          p_currency: tx?.currency || "NGN",
          p_user_id: metadata.student_id || null,
        });
        if (rpcErr) {
          const { error: upErr } = await supabase.from("payments").upsert(
            {
              reference,
              email: email || "unknown@paystack.local",
              course_slug: courseSlug || "unknown",
              course_title: metadata.course_title || null,
              certificate_id: certificateId || reference,
              amount_kobo: amount,
              currency: tx?.currency || "NGN",
              status: "success",
              provider: "paystack",
              paid_at: tx?.paid_at || new Date().toISOString(),
              user_id: metadata.student_id || null,
              metadata: metadata as object,
            },
            { onConflict: "reference" },
          );
          persisted = !upErr;
        } else {
          persisted = true;
        }
      } catch {
        persisted = false;
      }
    }
  }

  return NextResponse.json({
    paid,
    persisted,
    reference: tx?.reference || reference,
    amount,
    currency: tx?.currency || "NGN",
    metadata,
    paidAt: tx?.paid_at,
    customer: email || tx?.customer?.email,
    courseSlug,
    certificateId,
  });
}
