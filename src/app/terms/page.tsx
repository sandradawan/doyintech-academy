export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 1, 2026</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          Doyintech Academy provides online learning materials, quizzes, and certificates. By creating
          an account or using the site you agree to these terms.
        </p>
        <h2 className="font-display text-lg font-semibold text-fg">Accounts</h2>
        <p>You are responsible for your login credentials and activity under your account.</p>
        <h2 className="font-display text-lg font-semibold text-fg">Courses & certificates</h2>
        <p>
          Certificates are issued when assessment requirements are met. Download may require payment.
          Certificate IDs may be verified publicly.
        </p>
        <h2 className="font-display text-lg font-semibold text-fg">Payments</h2>
        <p>Payments are processed by third-party providers such as Paystack.</p>
        <h2 className="font-display text-lg font-semibold text-fg">Acceptable use</h2>
        <p>Do not attack the platform, abuse assessments, or post unlawful content.</p>
      </div>
    </main>
  );
}
