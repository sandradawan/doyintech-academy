import { NextResponse } from "next/server";
import { enrolledEmailHtml, sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`email-enrolled:${ip}`, 10, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as {
    email?: string;
    name?: string;
    courseTitle?: string;
    courseSlug?: string;
  };
  if (!body.email || !body.courseSlug) {
    return NextResponse.json({ error: "email and courseSlug required" }, { status: 400 });
  }

  const result = await sendEmail({
    to: body.email,
    subject: `Enrolled: ${body.courseTitle || body.courseSlug}`,
    html: enrolledEmailHtml(body.name || "", body.courseTitle || body.courseSlug, body.courseSlug),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
