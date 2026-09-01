export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 1, 2026</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          We collect account data (name, email), learning progress, quiz scores, payment references,
          and technical logs needed to run the Academy.
        </p>
        <h2 className="font-display text-lg font-semibold text-fg">How we use data</h2>
        <p>
          To authenticate you, deliver courses, issue certificates, process payments, improve the
          product, and prevent abuse. We do not sell personal data.
        </p>
        <h2 className="font-display text-lg font-semibold text-fg">Processors</h2>
        <p>
          Infrastructure may include Vercel, Supabase, Paystack, and email providers when configured.
          Video embeds may load from YouTube.
        </p>
        <h2 className="font-display text-lg font-semibold text-fg">Cookies</h2>
        <p>We use essential cookies for session/auth and optional preferences such as theme.</p>
      </div>
    </main>
  );
}
