"use client";

import { ADMIN_PIN } from "@/lib/admin";
import { CERT_FEE_LABEL, CERT_PASS_SCORE } from "@/lib/certificates";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">Operational configuration for the academy CRM.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Access</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Admin PIN</dt>
              <dd className="mt-1 font-mono text-fg">{ADMIN_PIN} (change in src/lib/admin.ts)</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Admin URL</dt>
              <dd className="mt-1">/admin</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Certificates & payments</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Pass score</dt>
              <dd className="mt-1">{CERT_PASS_SCORE}%</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Download fee</dt>
              <dd className="mt-1">{CERT_FEE_LABEL} via Paystack</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">Env vars</dt>
              <dd className="mt-1 text-muted">
                PAYSTACK_SECRET_KEY, NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_*
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">CRM data storage</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Student directory, payments, notes, and activity currently persist in the browser
            (localStorage) so the CRM works without a service-role key. For multi-admin production,
            move these tables to Supabase with RLS for admin role and read Paystack via server routes only.
          </p>
        </section>
      </div>
    </div>
  );
}
