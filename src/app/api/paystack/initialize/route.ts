import { NextResponse } from "next/server";
import { CERT_FEE_KOBO, appBaseUrl } from "@/lib/paystack";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY in Vercel env." },
      { status: 503 },
    );
  }

  let body: {
    email?: string;
    courseSlug?: string;
    certificateId?: string;
    courseTitle?: string;
    studentId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const courseSlug = body.courseSlug?.trim();
  const certificateId = body.certificateId?.trim();
  if (!email || !courseSlug || !certificateId) {
    return NextResponse.json(
      { error: "email, courseSlug, and certificateId are required" },
      { status: 400 },
    );
  }

  const reference = `DTA-${certificateId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20)}-${Date.now()}`;
  const callback = `${appBaseUrl()}/payment/callback?course=${encodeURIComponent(courseSlug)}&cert=${encodeURIComponent(certificateId)}`;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: CERT_FEE_KOBO,
      currency: "NGN",
      reference,
      callback_url: callback,
      metadata: {
        course_slug: courseSlug,
        certificate_id: certificateId,
        course_title: body.courseTitle || courseSlug,
        student_id: body.studentId || "",
        product: "certificate_download",
      },
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status) {
    return NextResponse.json(
      { error: data?.message || "Paystack initialize failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url as string,
    access_code: data.data.access_code as string,
    reference: data.data.reference as string,
  });
}
