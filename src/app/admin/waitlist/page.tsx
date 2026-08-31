"use client";

import { useEffect, useState } from "react";
import { fetchWaitlistDb, type CrmWaitlistEntry } from "@/lib/admin-crm";

export default function AdminWaitlistPage() {
  const [rows, setRows] = useState<CrmWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setRows(await fetchWaitlistDb());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load waitlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function exportCsv() {
    const header = "email,name,source,createdAt\n";
    const body = rows
      .map((r) => `${JSON.stringify(r.email)},${JSON.stringify(r.name || "")},${JSON.stringify(r.source || "")},${r.createdAt}`)
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
          <p className="mt-1 text-sm text-muted">Supabase waitlist table (admin-only select).</p>
        </div>
        <button type="button" onClick={exportCsv} disabled={rows.length === 0}
          className="h-10 rounded-md border border-border px-3 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50">
          Export CSV
        </button>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Loading…</p> : null}
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-surface-2/40">
                <td className="px-4 py-3 font-medium">{r.email}</td>
                <td className="px-4 py-3 text-muted">{r.name || "—"}</td>
                <td className="px-4 py-3 text-xs text-subtle">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Waitlist is empty.</p>
        ) : null}
      </div>
    </div>
  );
}
