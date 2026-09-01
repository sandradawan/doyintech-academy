import { NextResponse } from "next/server";
import { certificateEmailHtml, sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`email-cert:${ip}`, 10, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    courseTitle?: string;
    certificateId?: string;
  };
  if (!body.email || !body.certificateId) {
    return NextResponse.json({ error: "email and certificateId required" }, { status: 400 });
  }

  const result = await sendEmail({
    to: body.email,
    subject: `Certificate: ${body.courseTitle || "Doyintech Academy"}`,
    html: certificateEmailHtml(body.name || "", body.courseTitle || "Your course", body.certificateId),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
