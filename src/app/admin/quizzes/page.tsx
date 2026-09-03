"use client";

import { useEffect, useState } from "react";
import { getCourse } from "@/lib/courses/catalog";
import { fetchQuizAttempts, type QuizAttemptRow } from "@/lib/admin-crm";
import { CERT_PASS_SCORE } from "@/lib/certificates";

export default function AdminQuizzesPage() {
  const [rows, setRows] = useState<QuizAttemptRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizAttempts(150)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const passRate =
    rows.length === 0 ? 0 : Math.round((rows.filter((r) => r.passed).length / rows.length) * 100);
  const avg =
    rows.length === 0 ? 0 : Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Quiz attempts</h1>
        <p className="mt-1 text-sm text-muted">
          Multi-question assessments stored in quiz_attempts (pass mark {CERT_PASS_SCORE}%).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Attempts</p>
          <p className="mt-1 font-display text-2xl font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Pass rate</p>
          <p className="mt-1 font-display text-2xl font-semibold">{passRate}%</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Avg score</p>
          <p className="mt-1 font-display text-2xl font-semibold">{avg}%</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          No quiz attempts yet. Students submit assessments from course pages.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-2 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Student</th>
                <th className="px-3 py-2 font-medium">Course</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Detail</th>
                <th className="px-3 py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const course = getCourse(r.courseSlug);
                return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <p className="font-medium">{r.studentName || "Student"}</p>
                      <p className="text-xs text-muted">{r.studentEmail || r.userId.slice(0, 8)}</p>
                    </td>
                    <td className="px-3 py-2">{course?.title || r.courseSlug}</td>
                    <td className="px-3 py-2">
                      <span className={r.passed ? "font-semibold text-success" : "font-semibold text-orange"}>
                        {r.score}%
                      </span>
                      <span className="ml-1 text-xs text-muted">{r.passed ? "pass" : "fail"}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted">
                      {r.correctCount != null && r.questionCount != null
                        ? `${r.correctCount}/${r.questionCount} correct`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
