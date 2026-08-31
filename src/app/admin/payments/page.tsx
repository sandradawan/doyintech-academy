"use client";

import { useEffect, useMemo, useState } from "react";
import { CERT_FEE_LABEL } from "@/lib/certificates";
import {
  formatNgn,
  getCrmPayments,
  paymentStats,
  recordCrmPayment,
  type CrmPayment,
} from "@/lib/admin-crm";

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<CrmPayment[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, revenueNgn: 0 });

  function refresh() {
    setRows(getCrmPayments());
    setStats(paymentStats());
  }

  useEffect(() => {
    refresh();
  }, []);

  const totalFmt = useMemo(() => formatNgn(stats.revenueNgn), [stats.revenueNgn]);

  function addManual() {
    const email = window.prompt("Student email?");
    if (!email) return;
    const cert = window.prompt("Certificate ID?", "DTA-MANUAL-001");
    if (!cert) return;
    const course = window.prompt("Course slug?", "web-foundations");
    if (!course) return;
    recordCrmPayment({
      reference: `manual_${Date.now()}`,
      email: email.trim().toLowerCase(),
      courseSlug: course.trim(),
      certificateId: cert.trim(),
      amountKobo: 2500 * 100,
      currency: "NGN",
      status: "success",
      paidAt: new Date().toISOString(),
      provider: "manual",
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted">
            Certificate download fees ({CERT_FEE_LABEL}) via Paystack and manual entries.
          </p>
        </div>
        <button
          type="button"
          onClick={addManual}
          className="h-10 rounded-md border border-border px-3 text-sm font-semibold hover:bg-surface-2"
        >
          Record manual payment
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Revenue</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{totalFmt}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Successful</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{stats.success}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Failed / total</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
            {stats.failed} / {stats.total}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Certificate</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-surface-2/40">
                <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                  {new Date(p.paidAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.email}</p>
                  <p className="text-xs text-muted">{p.courseSlug}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{p.certificateId}</td>
                <td className="px-4 py-3 tabular-nums font-semibold">
                  {formatNgn(p.amountKobo / 100)}
                </td>
                <td className="px-4 py-3 capitalize">
                  <span
                    className={
                      p.status === "success"
                        ? "text-success"
                        : p.status === "failed"
                          ? "text-orange"
                          : "text-muted"
                    }
                  >
                    {p.status}
                  </span>
                  <span className="ml-1 text-[10px] text-subtle">· {p.provider}</span>
                </td>
                <td className="px-4 py-3 max-w-[10rem] truncate font-mono text-[11px] text-subtle">
                  {p.reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            No payments recorded. Complete a Paystack checkout or add a manual payment.
          </p>
        ) : null}
      </div>
    </div>
  );
}
