import { NextResponse } from "next/server";
import { enrolledEmailHtml, sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`email-enrolled:${ip}`, 5, 60_000);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  // Require authenticated caller
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
