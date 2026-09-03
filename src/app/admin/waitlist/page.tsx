"use client";

import { useEffect, useState } from "react";
import { fetchWaitlistDb, type CrmWaitlistEntry } from "@/lib/admin-crm";
import { useRealtimeSync } from "@/lib/realtime";
import { LiveBadge } from "@/components/admin/live-badge";
import { PaginationBar, usePagedItems } from "@/components/admin/pagination";

const PAGE_SIZE = 20;

export default function AdminWaitlistPage() {
  const [rows, setRows] = useState<CrmWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  async function load(silent = false) {
    if (!silent) setLoading(true);
    try {
      setRows(await fetchWaitlistDb());
      setError("");
      setLive(true);
      setLastSync(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load waitlist");
      setLive(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useRealtimeSync(["waitlist"], () => {
    void load(true);
  });

  const filtered = q.trim()
    ? rows.filter(
        (r) =>
          r.email.toLowerCase().includes(q.trim().toLowerCase()) ||
          (r.name || "").toLowerCase().includes(q.trim().toLowerCase()),
      )
    : rows;

  const { slice, totalPages, safePage } = usePagedItems(filtered, PAGE_SIZE, page);

  function exportCsv() {
    const header = "email,name,source,createdAt\n";
    const body = rows
      .map(
        (r) =>
          `${JSON.stringify(r.email)},${JSON.stringify(r.name || "")},${JSON.stringify(r.source || "")},${r.createdAt}`,
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doyintech-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Waitlist</h1>
          <p className="mt-1 text-sm text-muted">Landing page signups · live sync</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LiveBadge live={live && !error} lastSync={lastSync} />
          <button type="button" onClick={exportCsv}
            className="h-9 rounded-md border border-border px-3 text-sm font-medium hover:bg-surface-2">
            Export CSV
          </button>
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Signups</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{rows.length}</p>
        </div>
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search email or name…"
          className="h-14 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No waitlist entries yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Source</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {slice.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-2/40">
                      <td className="px-4 py-3 font-medium">{r.email}</td>
                      <td className="px-4 py-3 text-muted">{r.name || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted">{r.source || "—"}</td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
