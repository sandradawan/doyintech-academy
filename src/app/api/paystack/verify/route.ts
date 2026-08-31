import { NextResponse } from "next/server";

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
  return NextResponse.json({
    paid,
    reference: tx?.reference,
    amount: tx?.amount,
    currency: tx?.currency,
    metadata: tx?.metadata ?? {},
    paidAt: tx?.paid_at,
    customer: tx?.customer?.email,
  });
}
