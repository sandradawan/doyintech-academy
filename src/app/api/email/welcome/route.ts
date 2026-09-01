import { NextResponse } from "next/server";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`email-welcome:${ip}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as { email?: string; name?: string };
  if (!body.email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const result = await sendEmail({
    to: body.email,
    subject: "Welcome to Doyintech Academy",
    html: welcomeEmailHtml(body.name || ""),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
