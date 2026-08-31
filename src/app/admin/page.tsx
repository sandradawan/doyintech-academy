"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  ListOrdered,
  TrendingUp,
  Users,
} from "lucide-react";
import { courses } from "@/lib/courses/catalog";
import { courseLessonCount } from "@/lib/courses/types";
import {
  fetchContentOverrides,
  fetchCrmActivity,
  fetchCrmPayments,
  fetchCrmStudents,
  fetchWaitlistDb,
  formatNgn,
  paymentStatsFrom,
  type CrmActivity,
  type CrmPayment,
} from "@/lib/admin-crm";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    students: 0, active: 0, payments: 0, revenue: 0, waitlist: 0, overrides: 0, lessons: 0, courses: 0,
  });
  const [activity, setActivity] = useState<CrmActivity[]>([]);
  const [recentPay, setRecentPay] = useState<CrmPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [students, payments, waitlist, overrides, acts] = await Promise.all([
          fetchCrmStudents(), fetchCrmPayments(), fetchWaitlistDb(), fetchContentOverrides(), fetchCrmActivity(12),
        ]);
        if (cancelled) return;
        const pay = paymentStatsFrom(payments);
        const lessonTotal = courses.reduce((n, c) => n + courseLessonCount(c), 0);
        setStats({
          students: students.length,
          active: students.filter((s) => s.status === "active").length,
          payments: pay.success,
          revenue: pay.revenueNgn,
          waitlist: waitlist.length,
          overrides: overrides.length,
          lessons: lessonTotal,
          courses: courses.length,
        });
        setActivity(acts);
        setRecentPay(payments.slice(0, 5));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const kpis = [
    { label: "Students", value: String(stats.students), sub: `${stats.active} active`, icon: Users, href: "/admin/students" },
    { label: "Revenue", value: formatNgn(stats.revenue), sub: `${stats.payments} paid certs`, icon: CreditCard, href: "/admin/payments" },
    { label: "Catalog", value: String(stats.courses), sub: `${stats.lessons} lessons`, icon: BookOpen, href: "/admin/content" },
    { label: "Waitlist", value: String(stats.waitlist), sub: `${stats.overrides} content edits`, icon: ListOrdered, href: "/admin/waitlist" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted">Live data from Supabase (profiles, enrollments, payments, waitlist).</p>
      </div>
      {error ? (
        <p className="rounded-lg border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-orange">
          {error} — run the CRM migration SQL and set your user role to admin.
        </p>
      ) : null}
      {loading ? <p className="text-sm text-muted">Loading metrics…</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="rounded-xl border border-border bg-surface p-5 hover:border-primary/40">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{k.label}</p>
              <k.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{k.value}</p>
            <p className="mt-1 text-xs text-subtle">{k.sub}</p>
          </Link>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent payments</h2>
            <Link href="/admin/payments" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </div>
          {recentPay.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No payments in the database yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recentPay.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.email}</p>
                    <p className="truncate text-xs text-muted">{p.certificateId} · {p.courseSlug}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold tabular-nums">{formatNgn(p.amountKobo / 100)}</p>
                    <p className="text-xs capitalize text-muted">{p.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No admin activity rows yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="border-b border-border pb-3 text-sm last:border-0">
                  <p className="text-fg">{a.message}</p>
                  <p className="mt-0.5 text-xs text-subtle">{new Date(a.createdAt).toLocaleString()} · {a.type}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Quick links</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/admin/content", label: "Edit lesson content", icon: BookOpen },
            { href: "/admin/students", label: "Manage students", icon: Users },
            { href: "/admin/enrollments", label: "Enrollment map", icon: GraduationCap },
          ].map((q) => (
            <Link key={q.href} href={q.href} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-surface-2">
              <q.icon className="size-4 text-primary" />{q.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
