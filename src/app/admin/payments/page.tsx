"use client";

import { useEffect, useMemo, useState } from "react";
import { CERT_FEE_LABEL } from "@/lib/certificates";
import {
  fetchCrmPayments,
  formatNgn,
  paymentStatsFrom,
  recordCrmPaymentDb,
  type CrmPayment,
} from "@/lib/admin-crm";
import { PaginationBar, usePagedItems } from "@/components/admin/pagination";
import { useRealtimeSync } from "@/lib/realtime";
import { LiveBadge } from "@/components/admin/live-badge";

const PAGE_SIZE = 15;

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<CrmPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed" | "pending">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function refresh(silent = false) {
    if (!silent) setLoading(true);
    try {
      setRows(await fetchCrmPayments());
      setError("");
      setLive(true);
      setLastSync(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payments");
      setLive(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useRealtimeSync(["payments"], () => {
    void refresh(true);
  });

  const stats = useMemo(() => paymentStatsFrom(rows), [rows]);
  const totalFmt = useMemo(() => formatNgn(stats.revenueNgn), [stats.revenueNgn]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!query) return true;
      return (
        p.email.toLowerCase().includes(query) ||
        p.certificateId.toLowerCase().includes(query) ||
        p.reference.toLowerCase().includes(query) ||
        p.courseSlug.toLowerCase().includes(query)
      );
    });
  }, [rows, statusFilter, q]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, q]);

  const { slice, totalPages, safePage } = usePagedItems(filtered, PAGE_SIZE, page);

  async function addManual() {
    const email = window.prompt("Student email?");
    if (!email) return;
    const cert = window.prompt("Certificate ID?", "DTA-MANUAL-001");
    if (!cert) return;
    const course = window.prompt("Course slug?", "web-foundations");
    if (!course) return;
    try {
      await recordCrmPaymentDb({
        reference: `manual_${Date.now()}`,
        email: email.trim().toLowerCase(),
        courseSlug: course.trim(),
        certificateId: cert.trim(),
        amountKobo: 2500 * 100,
        status: "success",
        provider: "manual",
      });
      await refresh(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record payment");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="mt-1 text-sm text-muted">Supabase payments · certificate fee {CERT_FEE_LABEL}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LiveBadge live={live && !error} lastSync={lastSync} />
          <button type="button" onClick={addManual}
            className="h-10 rounded-md border border-border px-3 text-sm font-semibold hover:bg-surface-2">
            Record manual payment
          </button>
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Revenue</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{totalFmt}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Successful</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{stats.success}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Failed / total</p>
          <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{stats.failed} / {stats.total}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email, certificate, reference…"
          className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
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
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
              ) : (
                slice.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-2/40">
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-muted">{new Date(p.paidAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.email}</p>
                      <p className="text-xs text-muted">{p.courseSlug}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.certificateId}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatNgn(p.amountKobo / 100)}</td>
                    <td className="px-4 py-3 capitalize">
                      <span className={p.status === "success" ? "text-success" : p.status === "failed" ? "text-orange" : "text-muted"}>{p.status}</span>
                      <span className="ml-1 text-[10px] text-subtle">· {p.provider}</span>
                    </td>
                    <td className="max-w-[10rem] truncate px-4 py-3 font-mono text-[11px] text-subtle">{p.reference}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No payments match this filter.</p>
        ) : (
          <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
