"use client";

const PAYMENTS_KEY = "doyintech-academy-crm-payments";
const STUDENTS_KEY = "doyintech-academy-crm-students";
const NOTES_KEY = "doyintech-academy-crm-notes";
const ACTIVITY_KEY = "doyintech-academy-crm-activity";

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

export type CrmNote = {
  id: string;
  entityType: "student" | "payment" | "content";
  entityId: string;
  body: string;
  createdAt: string;
  author: string;
};

export type CrmActivity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  meta?: Record<string, string>;
};

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getCrmPayments(): CrmPayment[] {
  if (typeof window === "undefined") return [];
  return parse<CrmPayment[]>(localStorage.getItem(PAYMENTS_KEY), []).sort((a, b) =>
    b.paidAt.localeCompare(a.paidAt),
  );
}

export function recordCrmPayment(input: Omit<CrmPayment, "id">) {
  const list = getCrmPayments();
  const existing = list.findIndex((p) => p.reference === input.reference);
  const row: CrmPayment = { ...input, id: existing >= 0 ? list[existing].id : uid("pay") };
  if (existing >= 0) list[existing] = row;
  else list.unshift(row);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(list));
  pushActivity({
    type: "payment",
    message: `Payment ${input.status}: ${input.email} · ${input.certificateId}`,
    meta: { reference: input.reference, course: input.courseSlug },
  });
  return row;
}

export function paymentStats() {
  const all = getCrmPayments();
  const success = all.filter((p) => p.status === "success");
  const revenueKobo = success.reduce((s, p) => s + p.amountKobo, 0);
  return {
    total: all.length,
    success: success.length,
    failed: all.filter((p) => p.status === "failed").length,
    revenueKobo,
    revenueNgn: revenueKobo / 100,
  };
}

export function getCrmStudents(): CrmStudent[] {
  if (typeof window === "undefined") return [];
  return parse<CrmStudent[]>(localStorage.getItem(STUDENTS_KEY), []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function upsertCrmStudent(student: CrmStudent) {
  const list = getCrmStudents();
  const i = list.findIndex((s) => s.id === student.id || s.email === student.email);
  if (i >= 0) list[i] = { ...list[i], ...student };
  else list.unshift(student);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
  return student;
}

export function setStudentStatus(id: string, status: CrmStudent["status"]) {
  const list = getCrmStudents();
  const i = list.findIndex((s) => s.id === id);
  if (i < 0) return;
  list[i] = { ...list[i], status };
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(list));
  pushActivity({
    type: "student",
    message: `Student ${list[i].email} marked ${status}`,
    meta: { studentId: id },
  });
}

export function seedDemoStudentsIfEmpty() {
  if (getCrmStudents().length > 0) return;
  const demos: CrmStudent[] = [
    {
      id: "stu_demo_1",
      name: "Adaeze Okonkwo",
      email: "adaeze@example.com",
      role: "student",
      createdAt: "2026-08-01T10:00:00.000Z",
      enrolledCourses: ["web-foundations", "react-essentials"],
      certificateCount: 1,
      lastActiveAt: "2026-08-30T12:00:00.000Z",
      status: "active",
    },
    {
      id: "stu_demo_2",
      name: "Kwame Boateng",
      email: "kwame@example.com",
      role: "student",
      createdAt: "2026-08-10T09:00:00.000Z",
      enrolledCourses: ["javascript-mastery"],
      certificateCount: 0,
      lastActiveAt: "2026-08-28T18:00:00.000Z",
      status: "active",
    },
    {
      id: "stu_demo_3",
      name: "Ngozi Ibe",
      email: "ngozi@example.com",
      role: "student",
      createdAt: "2026-08-15T14:00:00.000Z",
      enrolledCourses: ["git-professional-workflow"],
      certificateCount: 0,
      status: "inactive",
    },
  ];
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(demos));
}

export function getCrmNotes(entityType?: string, entityId?: string): CrmNote[] {
  if (typeof window === "undefined") return [];
  let list = parse<CrmNote[]>(localStorage.getItem(NOTES_KEY), []);
  if (entityType) list = list.filter((n) => n.entityType === entityType);
  if (entityId) list = list.filter((n) => n.entityId === entityId);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addCrmNote(input: Omit<CrmNote, "id" | "createdAt">) {
  const list = getCrmNotes();
  const note: CrmNote = {
    ...input,
    id: uid("note"),
    createdAt: new Date().toISOString(),
  };
  list.unshift(note);
  localStorage.setItem(NOTES_KEY, JSON.stringify(list));
  return note;
}

export function getCrmActivity(limit = 30): CrmActivity[] {
  if (typeof window === "undefined") return [];
  return parse<CrmActivity[]>(localStorage.getItem(ACTIVITY_KEY), []).slice(0, limit);
}

export function pushActivity(input: Omit<CrmActivity, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const list = getCrmActivity(100);
  list.unshift({
    ...input,
    id: uid("act"),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list.slice(0, 100)));
}

export function formatNgn(amountNgn: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amountNgn);
}
