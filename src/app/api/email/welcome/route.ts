import { NextResponse } from "next/server";
import { sendEmail, welcomeEmailHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`email-welcome:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Basic origin / referer check to reduce pure external abuse
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const allowed =
    origin.includes("doyintechacademy") ||
    origin.includes("localhost") ||
    referer.includes("doyintechacademy") ||
    referer.includes("localhost");
  if (!allowed && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as { email?: string; name?: string };
  if (!body.email || typeof body.email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const result = await sendEmail({
    to: email,
    subject: "Welcome to Doyintech Academy",
    html: welcomeEmailHtml(body.name || ""),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
