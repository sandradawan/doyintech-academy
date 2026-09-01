"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { courses } from "@/lib/courses/catalog";

type Stats = {
  students: number;
  enrollments: number;
  payments: number;
  revenueKobo: number;
  certificates: number;
  byCourse: { slug: string; title: string; count: number }[];
};

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const [p, e, pay] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("enrollments").select("course_slug, certificate_id"),
          supabase.from("payments").select("amount_kobo, status"),
        ]);
        const enrollments = e.data || [];
        const payments = (pay.data || []).filter((x) => x.status === "success");
        const byMap: Record<string, number> = {};
        for (const row of enrollments) {
          byMap[row.course_slug] = (byMap[row.course_slug] || 0) + 1;
        }
        setStats({
          students: p.count || 0,
          enrollments: enrollments.length,
          payments: payments.length,
          revenueKobo: payments.reduce((n, x) => n + (x.amount_kobo || 0), 0),
          certificates: enrollments.filter((x) => x.certificate_id).length,
          byCourse: courses
            .map((c) => ({
              slug: c.slug,
              title: c.title,
              count: byMap[c.slug] || 0,
            }))
            .sort((a, b) => b.count - a.count),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      }
    })();
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!stats) return <p className="text-sm text-muted">Loading analytics…</p>;

  const cards = [
    { label: "Students", value: stats.students },
    { label: "Enrollments", value: stats.enrollments },
    { label: "Certificates", value: stats.certificates },
    { label: "Successful payments", value: stats.payments },
    { label: "Revenue (NGN)", value: `₦${(stats.revenueKobo / 100).toLocaleString()}` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-muted">Live totals from Supabase</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-[11px] font-medium tracking-wide text-muted uppercase">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-lg font-semibold">Enrollments by course</h2>
      <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
        {stats.byCourse.map((r) => (
          <li key={r.slug} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="min-w-0 truncate font-medium">{r.title}</span>
            <span className="tabular-nums text-muted">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
