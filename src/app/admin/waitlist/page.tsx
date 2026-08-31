"use client";

import { useEffect, useState } from "react";
import { getWaitlist, type WaitlistEntry } from "@/lib/admin";

export default function AdminWaitlistPage() {
  const [rows, setRows] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    setRows(getWaitlist());
  }, []);

  function exportCsv() {
    const header = "email,name,createdAt\n";
    const body = rows
      .map((r) => `${JSON.stringify(r.email)},${JSON.stringify(r.name)},${r.createdAt}`)
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
          <p className="mt-1 text-sm text-muted">Landing page signups stored in this browser.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="h-10 rounded-md border border-border px-3 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

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
              <tr key={`${r.email}-${r.createdAt}`} className="hover:bg-surface-2/40">
                <td className="px-4 py-3 font-medium">{r.email}</td>
                <td className="px-4 py-3 text-muted">{r.name || "—"}</td>
                <td className="px-4 py-3 text-xs text-subtle">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Waitlist is empty.</p>
        ) : null}
      </div>
    </div>
  );
}
