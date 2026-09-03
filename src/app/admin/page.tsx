"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
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
  fetchEnrollmentMap,
  fetchQuizAttempts,
  fetchWaitlistDb,
  formatNgn,
  paymentStatsFrom,
  type CrmActivity,
  type CrmPayment,
} from "@/lib/admin-crm";
import { adminHref } from "@/lib/admin-path";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    students: 0,
    active: 0,
    payments: 0,
    revenue: 0,
    waitlist: 0,
    overrides: 0,
    lessons: 0,
    courses: 0,
    enrollments: 0,
    uniqueEnrolled: 0,
    quizAttempts: 0,
    quizPassRate: 0,
  });
  const [activity, setActivity] = useState<CrmActivity[]>([]);
  const [recentPay, setRecentPay] = useState<CrmPayment[]>([]);
  const [topCourses, setTopCourses] = useState<{ title: string; count: number; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [students, payments, waitlist, overrides, acts, enrollments, quizzes] =
          await Promise.all([
            fetchCrmStudents(),
            fetchCrmPayments(),
            fetchWaitlistDb(),
            fetchContentOverrides(),
            fetchCrmActivity(12),
            fetchEnrollmentMap(),
            fetchQuizAttempts(200),
          ]);
        if (cancelled) return;
        const pay = paymentStatsFrom(payments);
        const lessonTotal = courses.reduce((n, c) => n + courseLessonCount(c), 0);
        const bySlug = new Map<string, number>();
        for (const e of enrollments) {
          bySlug.set(e.courseSlug, (bySlug.get(e.courseSlug) || 0) + 1);
        }
        const top = courses
          .map((c) => ({ slug: c.slug, title: c.title, count: bySlug.get(c.slug) || 0 }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        const passRate =
          quizzes.length === 0
            ? 0
            : Math.round((quizzes.filter((q) => q.passed).length / quizzes.length) * 100);

        setStats({
          students: students.length,
          active: students.filter((s) => s.status === "active").length,
          payments: pay.success,
          revenue: pay.revenueNgn,
          waitlist: waitlist.length,
          overrides: overrides.length,
          lessons: lessonTotal,
          courses: courses.length,
          enrollments: enrollments.length,
          uniqueEnrolled: new Set(enrollments.map((e) => e.userId)).size,
          quizAttempts: quizzes.length,
          quizPassRate: passRate,
        });
        setActivity(acts);
        setRecentPay(payments.slice(0, 6));
        setTopCourses(top);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = [
    { label: "Students", value: String(stats.students), sub: `${stats.active} active`, icon: Users, href: adminHref("/students") },
    { label: "Enrollments", value: String(stats.enrollments), sub: `${stats.uniqueEnrolled} unique learners`, icon: GraduationCap, href: adminHref("/enrollments") },
    { label: "Revenue", value: formatNgn(stats.revenue), sub: `${stats.payments} paid certificates`, icon: CreditCard, href: adminHref("/payments") },
    { label: "Quiz attempts", value: String(stats.quizAttempts), sub: `${stats.quizPassRate}% pass rate`, icon: ClipboardList, href: adminHref("/quizzes") },
    { label: "Catalog", value: String(stats.courses), sub: `${stats.lessons} lessons`, icon: BookOpen, href: adminHref("/content") },
    { label: "Waitlist", value: String(stats.waitlist), sub: `${stats.overrides} content overrides`, icon: ListOrdered, href: adminHref("/waitlist") },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            Live CRM metrics from Supabase — students, enrollments, payments, quizzes.
          </p>
        </div>
        {loading ? <p className="text-xs text-muted">Refreshing…</p> : null}
      </div>

      {error ? (
        <p className="rounded-lg border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-orange">
          {error} — confirm CRM migrations and that your profile role is{" "}
          <code className="text-xs">admin</code>.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{k.label}</p>
              <k.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{k.value}</p>
            <p className="mt-1 text-xs text-subtle">{k.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-surface p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Top courses</h2>
            <Link href={adminHref("/enrollments")} className="text-xs font-medium text-primary hover:underline">
              Enrollments
            </Link>
          </div>
          {topCourses.every((c) => c.count === 0) ? (
            <p className="mt-6 text-sm text-muted">No enrollments yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topCourses.map((c) => {
                const max = Math.max(topCourses[0]?.count || 1, 1);
                const pct = Math.round((c.count / max) * 100);
                return (
                  <li key={c.slug}>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{c.title}</span>
                      <span className="shrink-0 tabular-nums text-primary font-semibold">{c.count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent payments</h2>
            <Link href={adminHref("/payments")} className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
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

        <section className="rounded-xl border border-border bg-surface p-5 lg:col-span-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No admin activity rows yet.</p>
          ) : (
            <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {activity.map((a) => (
                <li key={a.id} className="border-b border-border pb-3 text-sm last:border-0">
                  <p className="text-fg">{a.message}</p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {new Date(a.createdAt).toLocaleString()} · {a.type}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: adminHref("/content"), label: "Edit lesson content", icon: BookOpen },
            { href: adminHref("/students"), label: "Manage students", icon: Users },
            { href: adminHref("/enrollments"), label: "Enrollment map", icon: GraduationCap },
            { href: adminHref("/payments"), label: "Payments & revenue", icon: CreditCard },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-surface-2"
            >
              <q.icon className="size-4 text-primary" />
              {q.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
