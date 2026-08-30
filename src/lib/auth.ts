"use client";

export type Student = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Enrollment = {
  courseSlug: string;
  enrolledAt: string;
  completedLessons: string[];
  quizScore?: number;
  certificateId?: string;
  certifiedAt?: string;
};

const STUDENT_KEY = "doyintech-academy-student";
const ENROLLMENTS_KEY = "doyintech-academy-enrollments";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getStudent(): Student | null {
  if (typeof window === "undefined") return null;
  return safeParse<Student | null>(localStorage.getItem(STUDENT_KEY), null);
}

export function signUp(name: string, email: string): Student {
  const student: Student = {
    id: `stu_${crypto.randomUUID().slice(0, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
  return student;
}

export function signIn(email: string): Student | null {
  const existing = getStudent();
  if (existing && existing.email === email.trim().toLowerCase()) {
    return existing;
  }
  return null;
}

export function signOut() {
  localStorage.removeItem(STUDENT_KEY);
}

export function getEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return [];
  return safeParse<Enrollment[]>(localStorage.getItem(ENROLLMENTS_KEY), []);
}

export function saveEnrollments(list: Enrollment[]) {
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(list));
}

export function enrollInCourse(courseSlug: string): Enrollment {
  const list = getEnrollments();
  const found = list.find((e) => e.courseSlug === courseSlug);
  if (found) return found;
  const enrollment: Enrollment = {
    courseSlug,
    enrolledAt: new Date().toISOString(),
    completedLessons: [],
  };
  list.push(enrollment);
  saveEnrollments(list);
  return enrollment;
}

export function getEnrollment(courseSlug: string): Enrollment | undefined {
  return getEnrollments().find((e) => e.courseSlug === courseSlug);
}

export function markLessonComplete(courseSlug: string, lessonId: string) {
  const list = getEnrollments();
  const enrollment = list.find((e) => e.courseSlug === courseSlug);
  if (!enrollment) return;
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
    saveEnrollments(list);
  }
}

export function completeQuiz(courseSlug: string, score: number): Enrollment | undefined {
  const list = getEnrollments();
  const enrollment = list.find((e) => e.courseSlug === courseSlug);
  if (!enrollment) return undefined;
  enrollment.quizScore = score;
  if (score >= 70 && !enrollment.certificateId) {
    enrollment.certificateId = `DTA-${courseSlug.slice(0, 3).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    enrollment.certifiedAt = new Date().toISOString();
  }
  saveEnrollments(list);
  return enrollment;
}

export function progressPercent(courseSlug: string, totalLessons: number): number {
  const enrollment = getEnrollment(courseSlug);
  if (!enrollment || totalLessons === 0) return 0;
  return Math.round((enrollment.completedLessons.length / totalLessons) * 100);
}
