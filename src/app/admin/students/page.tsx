"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { fetchCrmStudents, setStudentStatusDb, type CrmStudent } from "@/lib/admin-crm";
import { getCourse } from "@/lib/courses/catalog";
import { cn } from "@/lib/utils";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<CrmStudent[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      setStudents(await fetchCrmStudents());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return students.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      );
    });
  }, [students, q, filter]);

  async function changeStatus(id: string, status: CrmStudent["status"]) {
    try {
      await setStudentStatusDb(id, status);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Students</h1>
        <p className="mt-1 text-sm text-muted">From Supabase profiles + enrollments.</p>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {loading ? <p className="text-sm text-muted">Loading…</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
            className="h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold">Enrollments</th>
              <th className="px-4 py-3 font-semibold">Certs</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted">{s.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {s.enrolledCourses.length === 0 ? (
                      <span className="text-xs text-subtle">None</span>
                    ) : (
                      s.enrolledCourses.map((slug) => (
                        <span key={slug} className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] text-muted">
                          {getCourse(slug)?.title || slug}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 tabular-nums">{s.certificateCount}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                    s.status === "active" && "bg-success/15 text-success",
                    s.status === "inactive" && "bg-surface-2 text-muted",
                    s.status === "suspended" && "bg-orange/15 text-orange",
                  )}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <select value={s.status} onChange={(e) => changeStatus(s.id, e.target.value as CrmStudent["status"])}
                    className="rounded-md border border-border bg-bg px-2 py-1.5 text-xs">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No students in the database yet.</p>
        ) : null}
      </div>
    </div>
  );
}
