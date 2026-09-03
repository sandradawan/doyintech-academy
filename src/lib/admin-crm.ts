"use client";

import { createClient } from "@/lib/supabase/client";

export type CrmPayment = {
  id: string;
  reference: string;
  email: string;
  studentId?: string;
  courseSlug: string;
  courseTitle?: string;
  certificateId: string;
  amountKobo: number;
  currency: string;
  status: "success" | "failed" | "pending";
  paidAt: string;
  provider: "paystack" | "manual";
};

export type CrmStudent = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  createdAt: string;
  enrolledCourses: string[];
  certificateCount: number;
  lastActiveAt?: string;
  status: "active" | "inactive" | "suspended";
};

export type CrmActivity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  meta?: Record<string, string>;
};

export type CrmWaitlistEntry = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  createdAt: string;
};

export type ContentOverrideRow = {
  id: string;
  courseSlug: string;
  lessonId: string;
  title?: string;
  summary?: string;
  videoUrl?: string;
  youtubeId?: string;
  body?: string;
  quizJson?: unknown[];
  updatedAt: string;
};

export type QuizAttemptRow = {
  id: string;
  userId: string;
  courseSlug: string;
  score: number;
  passed: boolean;
  questionCount: number | null;
  correctCount: number | null;
  createdAt: string;
  studentName?: string;
  studentEmail?: string;
};

function sb() {
  return createClient() as any;
}

export async function fetchIsAdmin(): Promise<boolean> {
  const supabase = sb();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return data?.role === "admin";
}

export async function fetchCrmStudents(): Promise<CrmStudent[]> {
  const supabase = sb();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, status, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error || !profiles) return [];
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id, course_slug, certificate_id");
  const byUser = new Map<string, { courses: string[]; certs: number }>();
  for (const e of enrollments ?? []) {
    const cur = byUser.get(e.user_id) ?? { courses: [], certs: 0 };
    cur.courses.push(e.course_slug);
    if (e.certificate_id) cur.certs += 1;
    byUser.set(e.user_id, cur);
  }
  return (profiles as any[]).map((p) => {
    const agg = byUser.get(p.id) ?? { courses: [], certs: 0 };
    return {
      id: p.id,
      name: p.full_name || p.email?.split("@")[0] || "Student",
      email: p.email,
      role: (p.role as "student" | "admin") || "student",
      createdAt: p.created_at,
      enrolledCourses: agg.courses,
      certificateCount: agg.certs,
      lastActiveAt: p.updated_at,
      status: (p.status as CrmStudent["status"]) || "active",
    };
  });
}

export async function setStudentStatusDb(id: string, status: CrmStudent["status"]) {
  const supabase = sb();
  const { error } = await supabase.rpc("admin_set_student_status", {
    p_user_id: id,
    p_status: status,
  });
  if (error) {
    const { error: e2 } = await supabase
      .from("profiles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (e2) throw new Error(e2.message);
  }
  await pushActivityDb({ type: "student", message: `Student status set to ${status}`, meta: { studentId: id } });
}

export async function fetchCrmPayments(): Promise<CrmPayment[]> {
  const supabase = sb();
  const { data, error } = await supabase.from("payments").select("*").order("paid_at", { ascending: false });
  if (error || !data) return [];
  return (data as any[]).map((p) => ({
    id: p.id,
    reference: p.reference,
    email: p.email,
    studentId: p.user_id ?? undefined,
    courseSlug: p.course_slug,
    courseTitle: p.course_title ?? undefined,
    certificateId: p.certificate_id,
    amountKobo: p.amount_kobo,
    currency: p.currency || "NGN",
    status: p.status,
    paidAt: p.paid_at,
    provider: p.provider || "paystack",
  }));
}

export async function recordCrmPaymentDb(input: {
  reference: string;
  email: string;
  studentId?: string;
  courseSlug: string;
  courseTitle?: string;
  certificateId: string;
  amountKobo: number;
  currency?: string;
  status: "success" | "failed" | "pending";
  provider: "paystack" | "manual";
}) {
  const supabase = sb();
  const { data, error } = await supabase.rpc("record_payment", {
    p_reference: input.reference,
    p_email: input.email,
    p_course_slug: input.courseSlug,
    p_certificate_id: input.certificateId,
    p_amount_kobo: input.amountKobo,
    p_status: input.status,
    p_provider: input.provider,
    p_course_title: input.courseTitle ?? null,
    p_currency: input.currency || "NGN",
    p_user_id: input.studentId ?? null,
  });
  if (error) {
    const { error: e2 } = await supabase.from("payments").upsert(
      {
        reference: input.reference,
        user_id: input.studentId ?? null,
        email: input.email.toLowerCase().trim(),
        course_slug: input.courseSlug,
        course_title: input.courseTitle ?? null,
        certificate_id: input.certificateId,
        amount_kobo: input.amountKobo,
        currency: input.currency || "NGN",
        status: input.status,
        provider: input.provider,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "reference" },
    );
    if (e2) throw new Error(e2.message);
  }
  await pushActivityDb({
    type: "payment",
    message: `Payment ${input.status}: ${input.email} · ${input.certificateId}`,
    meta: { reference: input.reference, course: input.courseSlug },
  });
  return data;
}

export function paymentStatsFrom(rows: CrmPayment[]) {
  const success = rows.filter((p) => p.status === "success");
  const revenueKobo = success.reduce((s, p) => s + p.amountKobo, 0);
  return {
    total: rows.length,
    success: success.length,
    failed: rows.filter((p) => p.status === "failed").length,
    revenueKobo,
    revenueNgn: revenueKobo / 100,
  };
}

export async function fetchWaitlistDb(): Promise<CrmWaitlistEntry[]> {
  const supabase = sb();
  const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as any[]).map((w) => ({
    id: w.id,
    email: w.email,
    name: w.name,
    source: w.source,
    createdAt: w.created_at,
  }));
}

export async function fetchContentOverrides(): Promise<ContentOverrideRow[]> {
  const supabase = sb();
  const { data, error } = await supabase.from("content_overrides").select("*");
  if (error || !data) return [];
  return (data as any[]).map((o) => ({
    id: o.id,
    courseSlug: o.course_slug,
    lessonId: o.lesson_id,
    title: o.title ?? undefined,
    summary: o.summary ?? undefined,
    videoUrl: o.video_url ?? undefined,
    youtubeId: o.youtube_id ?? undefined,
    body: o.body ?? undefined,
    quizJson: Array.isArray(o.quiz_json) ? o.quiz_json : undefined,
    updatedAt: o.updated_at,
  }));
}

export async function saveContentOverrideDb(input: {
  courseSlug: string;
  lessonId: string;
  title?: string;
  summary?: string;
  videoUrl?: string;
  youtubeId?: string;
  body?: string;
  quizJson?: unknown[];
}) {
  const supabase = sb();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("content_overrides").upsert(
    {
      course_slug: input.courseSlug,
      lesson_id: input.lessonId,
      title: input.title ?? null,
      summary: input.summary ?? null,
      video_url: input.videoUrl ?? null,
      youtube_id: input.youtubeId ?? null,
      body: input.body ?? null,
      quiz_json: input.quizJson ?? [],
      updated_by: user?.id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "course_slug,lesson_id" },
  );
  if (error) throw new Error(error.message);
  await pushActivityDb({
    type: "content",
    message: `Updated content for ${input.lessonId} (${input.courseSlug})`,
    meta: { lessonId: input.lessonId, courseSlug: input.courseSlug },
  });
}

export async function fetchCrmActivity(limit = 30): Promise<CrmActivity[]> {
  const supabase = sb();
  const { data, error } = await supabase
    .from("admin_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as any[]).map((a) => ({
    id: a.id,
    type: a.activity_type,
    message: a.message,
    createdAt: a.created_at,
    meta: (a.meta as Record<string, string>) || undefined,
  }));
}

export async function pushActivityDb(input: { type: string; message: string; meta?: Record<string, string> }) {
  const supabase = sb();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("admin_activity").insert({
    actor_id: user?.id ?? null,
    activity_type: input.type,
    message: input.message,
    meta: input.meta ?? {},
  });
}

export async function fetchEnrollmentMap(): Promise<
  { courseSlug: string; userId: string; studentName: string; studentEmail: string }[]
> {
  const supabase = sb();
  const { data, error } = await supabase.from("enrollments").select(`
    course_slug,
    user_id,
    profiles ( full_name, email )
  `);
  if (error || !data) return [];
  return (data as any[]).map((e) => ({
    courseSlug: e.course_slug,
    userId: e.user_id,
    studentName: e.profiles?.full_name || "Student",
    studentEmail: e.profiles?.email || "",
  }));
}

export function formatNgn(amountNgn: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amountNgn);
}

export async function fetchQuizAttempts(limit = 100): Promise<QuizAttemptRow[]> {
  const supabase = sb();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("id, user_id, course_slug, score, passed, question_count, correct_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  const userIds = [...new Set((data as any[]).map((r) => r.user_id).filter(Boolean))];
  let profileMap: Record<string, { full_name?: string; email?: string }> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    for (const p of profiles || []) {
      profileMap[p.id] = p;
    }
  }
  return (data as any[]).map((r) => ({
    id: r.id,
    userId: r.user_id,
    courseSlug: r.course_slug,
    score: r.score,
    passed: r.passed,
    questionCount: r.question_count ?? null,
    correctCount: r.correct_count ?? null,
    createdAt: r.created_at,
    studentName: profileMap[r.user_id]?.full_name || undefined,
    studentEmail: profileMap[r.user_id]?.email || undefined,
  }));
}
