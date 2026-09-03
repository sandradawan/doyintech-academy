"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { fetchCrmStudents, setStudentStatusDb, type CrmStudent } from "@/lib/admin-crm";
import { getCourse } from "@/lib/courses/catalog";
import { PaginationBar, usePagedItems } from "@/components/admin/pagination";
import { cn } from "@/lib/utils";
import { useRealtimeSync } from "@/lib/realtime";
import { LiveBadge } from "@/components/admin/live-badge";

const PAGE_SIZE = 15;

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<CrmStudent[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  async function refresh(silent = false) {
    if (!silent) setLoading(true);
    try {
      setStudents(await fetchCrmStudents());
      setError("");
      setLive(true);
      setLastSync(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load students");
      setLive(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useRealtimeSync(["profiles", "enrollments"], () => {
    void refresh(true);
  });

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

  useEffect(() => {
    setPage(1);
  }, [q, filter]);

  const { slice, totalPages, safePage } = usePagedItems(filtered, PAGE_SIZE, page);

  const counts = useMemo(
    () => ({
      all: students.length,
      active: students.filter((s) => s.status === "active").length,
      inactive: students.filter((s) => s.status === "inactive").length,
      suspended: students.filter((s) => s.status === "suspended").length,
      withEnroll: students.filter((s) => s.enrolledCourses.length > 0).length,
      withCert: students.filter((s) => s.certificateCount > 0).length,
    }),
    [students],
  );

  async function changeStatus(id: string, status: CrmStudent["status"]) {
    try {
      await setStudentStatusDb(id, status);
      await refresh(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Students</h1>
          <p className="mt-1 text-sm text-muted">Profiles, enrollments, and account status</p>
        </div>
        <LiveBadge live={live && !error} lastSync={lastSync} />
      </div>
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={counts.all} icon={Users} />
        <StatCard label="Active" value={counts.active} />
        <StatCard label="With enrollments" value={counts.withEnroll} />
        <StatCard label="With certificates" value={counts.withCert} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, or ID…"
            className="h-11 w-full rounded-md border border-border bg-surface pr-3 pl-10 text-sm outline-none focus:border-primary" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm">
          <option value="all">All statuses ({counts.all})</option>
          <option value="active">Active ({counts.active})</option>
          <option value="inactive">Inactive ({counts.inactive})</option>
          <option value="suspended">Suspended ({counts.suspended})</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-surface-2/50 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Enrollments</th>
                <th className="px-4 py-3 font-semibold">Certs</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">Loading…</td></tr>
              ) : (
                slice.map((s) => (
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
                    <td className="px-4 py-3 text-xs capitalize text-muted">{s.role}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No students match this filter.</p>
        ) : (
          <PaginationBar page={safePage} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{label}</p>
        {Icon ? <Icon className="size-4 text-primary" /> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
