// @ts-nocheck
"use client";

import { createClient } from "@/lib/supabase/client";
import type { Enrollment, EnrollmentRow, Profile, Student } from "@/lib/supabase/types";

export type { Enrollment, Student };

function mapProfile(p: Profile): Student {
  return {
    id: p.id,
    name: p.full_name || p.email.split("@")[0],
    email: p.email,
    createdAt: p.created_at,
    role: p.role,
  };
}

function mapEnrollment(row: EnrollmentRow, completedLessons: string[] = []): Enrollment {
  return {
    courseSlug: row.course_slug,
    enrolledAt: row.enrolled_at,
    completedLessons,
    quizScore: row.quiz_score ?? undefined,
    certificateId: row.certificate_id ?? undefined,
    certifiedAt: row.certified_at ?? undefined,
  };
}

export async function getStudent(): Promise<Student | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  if (error || !data) {
    return {
      id: user.id,
      name: (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Student",
      email: user.email || "",
      createdAt: user.created_at,
    };
  }
  return mapProfile(data as Profile);
}

export async function signUp(name: string, email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: name.trim() } },
  });
  if (error) return { student: null, error: error.message };
  if (!data.user) return { student: null, error: "Sign up failed" };
  const student = await getStudent();
  return {
    student:
      student ??
      ({
        id: data.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
      } satisfies Student),
    error: null,
  };
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { student: null, error: error.message };
  const student = await getStudent();
  return { student, error: student ? null : "Profile not found" };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getEnrollments(): Promise<Enrollment[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (error || !enrollments) return [];

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("course_slug, lesson_id")
    .eq("user_id", user.id);

  const byCourse = new Map<string, string[]>();
  for (const p of (progress ?? []) as { course_slug: string; lesson_id: string }[]) {
    const list = byCourse.get(p.course_slug) ?? [];
    list.push(p.lesson_id);
    byCourse.set(p.course_slug, list);
  }

  return (enrollments as EnrollmentRow[]).map((row) =>
    mapEnrollment(row, byCourse.get(row.course_slug) ?? []),
  );
}

export async function getEnrollment(courseSlug: string) {
  const all = await getEnrollments();
  return all.find((e) => e.courseSlug === courseSlug);
}

export async function enrollInCourse(courseSlug: string): Promise<Enrollment> {
  const supabase = createClient() as any;
  const { data, error } = await supabase.rpc("enroll_in_course", {
    p_course_slug: courseSlug,
  });
  if (error) throw new Error(error.message);
  return mapEnrollment(data as EnrollmentRow, []);
}

export async function markLessonComplete(courseSlug: string, lessonId: string) {
  const supabase = createClient() as any;
  const { error } = await supabase.rpc("complete_lesson", {
    p_course_slug: courseSlug,
    p_lesson_id: lessonId,
  });
  if (error) throw new Error(error.message);
  return getEnrollment(courseSlug);
}

export async function completeQuiz(courseSlug: string, score: number) {
  const supabase = createClient() as any;
  try {
    const { data, error } = await supabase.rpc("submit_course_quiz", {
      p_course_slug: courseSlug,
      p_score: score,
    });
    if (!error && data) return getEnrollment(courseSlug);
  } catch {
    /* fall through to direct update */
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;

  const patch: Record<string, unknown> = { quiz_score: score };
  if (score >= 60) {
    const { data: existing } = await supabase
      .from("enrollments")
      .select("certificate_id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .maybeSingle();
    if (!existing?.certificate_id) {
      const id = `DTA-${courseSlug.slice(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      patch.certificate_id = id;
      patch.certified_at = new Date().toISOString();
    }
  }

  await supabase
    .from("enrollments")
    .update(patch)
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug);

  return getEnrollment(courseSlug);
}

export function progressPercent(enrollment: Enrollment | undefined, totalLessons: number) {
  if (!enrollment || totalLessons === 0) return 0;
  return Math.round((enrollment.completedLessons.length / totalLessons) * 100);
}

export async function joinWaitlist(email: string, name?: string) {
  const supabase = createClient() as any;
  const payload = {
    email: email.trim().toLowerCase(),
    name: name?.trim() || null,
    source: "landing",
  };
  const { error } = await supabase.from("waitlist").insert(payload);
  if (error) {
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function verifyCertificate(certificateId: string) {
  const supabase = createClient() as any;
  const { data, error } = await supabase.rpc("verify_certificate", {
    p_certificate_id: certificateId,
  });
  if (error) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
}
