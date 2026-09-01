export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Doyintech Academy <onboarding@resend.dev>";

  if (!key) {
    console.info("[email:dev]", payload.to, payload.subject);
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

export function welcomeEmailHtml(name: string) {
  return `<p>Hi ${name || "there"},</p>
<p>Welcome to <strong>Doyintech Academy</strong>. Enroll in a course and learn module by module.</p>
<p><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://doyintechacademy.vercel.app"}/courses">Browse courses</a></p>`;
}

export function enrolledEmailHtml(name: string, courseTitle: string, slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://doyintechacademy.vercel.app";
  return `<p>Hi ${name || "there"},</p>
<p>You enrolled in <strong>${courseTitle}</strong>.</p>
<p><a href="${base}/courses/${slug}">Continue learning</a></p>`;
}

export function certificateEmailHtml(name: string, courseTitle: string, certId: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://doyintechacademy.vercel.app";
  return `<p>Hi ${name || "there"},</p>
<p>You earned a certificate for <strong>${courseTitle}</strong>.</p>
<p>Certificate ID: <code>${certId}</code></p>
<p><a href="${base}/certificates?id=${certId}">View certificate</a> ·
<a href="${base}/certificates/verify/${certId}">Public verify link</a></p>`;
}
