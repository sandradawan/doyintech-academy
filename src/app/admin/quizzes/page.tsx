"use client";

import { useEffect, useMemo, useState } from "react";
import { getCourse } from "@/lib/courses/catalog";
import { fetchQuizAttempts, type QuizAttemptRow } from "@/lib/admin-crm";
import { CERT_PASS_SCORE } from "@/lib/certificates";
import { PaginationBar, usePagedItems } from "@/components/admin/pagination";

const PAGE_SIZE = 15;

export default function AdminQuizzesPage() {
  const [rows, setRows] = useState<QuizAttemptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [resultFilter, setResultFilter] = useState<"all" | "pass" | "fail">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchQuizAttempts(300)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const passRate =
    rows.length === 0 ? 0 : Math.round((rows.filter((r) => r.passed).length / rows.length) * 100);
  const avg =
    rows.length === 0 ? 0 : Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (resultFilter === "pass" && !r.passed) return false;
      if (resultFilter === "fail" && r.passed) return false;
      if (!query) return true;
      const course = getCourse(r.courseSlug)?.title || r.courseSlug;
      return (
        (r.studentName || "").toLowerCase().includes(query) ||
        (r.studentEmail || "").toLowerCase().includes(query) ||
        course.toLowerCase().includes(query) ||
        r.courseSlug.toLowerCase().includes(query)
      );
    });
  }, [rows, q, resultFilter]);

  useEffect(() => {
    setPage(1);
  }, [q, resultFilter]);

  const { slice, totalPages, safePage } = usePagedItems(filtered, PAGE_SIZE, page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Quiz attempts</h1>
        <p className="mt-1 text-sm text-muted">Multi-question assessments (pass mark {CERT_PASS_SCORE}%).</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Attempts</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Pass rate</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{passRate}%</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Avg score</p>
          <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{avg}%</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search student or course…"
          className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary" />
        <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value as typeof resultFilter)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="all">All results</option>
          <option value="pass">Passed</option>
          <option value="fail">Failed</option>
        </select>
      </div>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          No quiz attempts match this filter.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Detail</th>
                  <th className="px-4 py-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {slice.map((r) => {
                  const course = getCourse(r.courseSlug);
                  return (
                    <tr key={r.id} className="hover:bg-surface-2/40">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.studentName || "Student"}</p>
                        <p className="text-xs text-muted">{r.studentEmail || r.userId.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3">{course?.title || r.courseSlug}</td>
                      <td className="px-4 py-3">
                        <span className={r.passed ? "font-semibold text-success" : "font-semibold text-orange"}>{r.score}%</span>
                        <span className="ml-1 text-xs text-muted">{r.passed ? "pass" : "fail"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {r.correctCount != null && r.questionCount != null ? `${r.correctCount}/${r.questionCount} correct` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
